import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error"; // 백엔드 통신 중 에러 발생시 에러 도출
import { setContext } from "@apollo/client/link/context";
import {
  getMainDefinition,
  offsetLimitPagination,
} from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "@apollo/client/link/ws";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

const TOKEN = "token";

// 네이티브는 localStorage가 없기 때문에 AsyncStorage 함수를 만들어야한다
export const logUserIn = async (token) => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token);
}; // async, await 빼고 AsyncStorage와 localStorage는 같다

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar(null);
};

const uploadHttpLink = createUploadLink({
  uri: "http://10.0.2.2:4000/graphql", // 안드로이드 스튜디오 연결시
  //uri: "http://1074-115-40-64-33.ngrok.io/graphql", // 폰으로 연결시
}); // UploadForm.js의 ReactNativeFile의 파일 업로드 때문에 createHttpLink에서 createUploadLink로 변경

const wsLink = new WebSocketLink({
  uri: "ws://10.0.2.2:4000/graphql",
  options: {
    reconnect: true,
    connectionParams: () => ({
      token: tokenVar(),
    }), // 웹소켓에 토큰 파라미터를 같이 보냄. connectionParams은 object,function 둘다 표현가능. obcject표현시 바로 token이 없어, 모든 request나 연결에 있어서 호출될 function으로 표현
  },
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(`GraphQL Error`, graphQLErrors);
  }
  if (networkError) {
    console.log("Network Error", networkError);
  }
}); // 백엔드 통신 오류시 왜 나는지 알 수 있다

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  };
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(),
      },
    },
  }, // typePolicies는 apollo에게 type을 설정할 수 있게 해준다
});

const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink); // authLink 다음 onErrorLink 다음 httpLink가 마지막에 거치는 링크이다. 즉 httpLink가 서버에 마지막으로 요청하는 link이다. (httpLink에서 uploadHttpLink로 변경)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    ); // 리턴값이 true이면 split는 wsLink를 사용한다. false이면 httpLink를 사용. 핵심적으로 definition.operation가 subscription이냐를 보고 판단
  },
  wsLink,
  httpLinks
); // split은 3개의 매개변수가진다. 첫번째 함수,두번째 wsLink,세번째 httpLink

const client = new ApolloClient({
  link: splitLink,
  cache,
});

/* 
  cache에서 두가지 일이 일어나는데 apollo가 query들을 argument에 따라 독립된 폴더 같은 곳에 저장한다.
  seeFeed: { keyArgs:false }는 query들을 argument에 따라 구별해주는 것을 막아준다. seeFeed가 모든 query를 하나로 인식하는데
  apollo에게 seeFeed의 새 데이터를 어떻게 처리해야 하는지 설정해야한다. 데이터를 replace할지, 새데이터만 보여줄지, 예전데이터만 보여줄지,
  데이터를 통합할지 등이 있다
  merge(existing = [], incoming = []) {  // existing은 기존 데이터, incoming은 새데이터
    return [...existing, ...incoming]; // 통합시킴
  }
  처음에는 existing,incoming이 빈 배열이다가 새데이터 오면 incoming이 채워지고 통합되어 incoming에 있던 데이터는 existing으로 가고
  또 새데이터가 오면 incoming에 채워진다.
  seeFeed: {
    keyArgs: false,
    merge(existing = [], incoming = []) {
      return [...existing, ...incoming];
    }
  },
  이렇게 하나의 쿼리로 인식하게 한뒤 데이터를 통합한다.
  위의 저 기능을 한줄로 표현한 것이 offsetLimitPagination()
*/

export default client;

/*
    Android 에뮬레이터를 사용하는 경우 localhost를 사용하여 graphql에 접근할 수 없다.
    에뮬레이터는 자체 IP 주소가있는 VM으로 실행된다.
    에뮬레이터의 IP 주소를 사용하여 접근해야한다.
    일반적으로 10.0.2.2 사용
*/
