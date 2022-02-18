// @apollo/client 버전 업그레이드로 인해 RN metro bundler와 충돌이 있어 설정, 파일명과 내용 그대로 이렇게 적어야함

const { getDefaultConfig } = require("metro-config");
const { resolver: defaultResolver } = getDefaultConfig.getDefaultValues();
exports.resolver = {
  ...defaultResolver,
  sourceExts: [...defaultResolver.sourceExts, "cjs"],
};
