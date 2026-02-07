// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "afzma",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const secret = new sst.Secret("OPENAI_API_KEY");
    const myWeb = new sst.aws.Nextjs("MyWeb", {
      domain: {
        name: "afzma.aws.shdkej.com",
        dns: sst.aws.dns({
          zone: "Z07242312C5BE3VLQW344",
        }),
      },
      link: [secret],
      environment: {
        REDEPLOY_SKIP_CACHE: Date.now().toString(),
      }
    });
    const fn = myWeb.nodes.server?.nodes.function;
    new aws.lambda.Permission("MyWebInvokePermission", {
      action: "lambda:InvokeFunctionUrl", 
      function: fn!.name,
      principal: "*",
      functionUrlAuthType: "NONE",
    });
  },
});
