import type { MiddlewareResponseHandler } from "astro";

export const onRequest: MiddlewareResponseHandler = async (context, next) => {
  let resolveServerFunctionPromise: (value: Response) => void;
  const serverFunctionPromise = new Promise<Response>((resolve) => {
    resolveServerFunctionPromise = resolve;
  });
  context.locals.register = async (key, fn) => {
    return new Promise<string>(async (resolve) => {
      if (context.request.method !== "POST") {
        return resolve(key);
      }
      const body = (await context.request.json()) as {
        fnKey: string;
      };
      if (body.fnKey !== key) {
        return resolve(key);
      }
      const result = await fn();
      resolveServerFunctionPromise(new Response(JSON.stringify(result)));
    });
  };
  const response = await Promise.race([next(), serverFunctionPromise]);
  return response;
};
