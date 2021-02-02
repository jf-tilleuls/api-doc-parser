import get from "lodash.get";
import { RdfProperty, RequestInitExtended } from "./types";
import { OpenAPIV3 } from "openapi-types";
import {
  fetchEntrypointAndDocs,
  findRelatedClass,
  findSupportedClass,
  removeTrailingSlash,
} from "./parseHydraDocumentation";

/**
 * Parses Hydra documentation and converts it to an OpenAPI representation.
 */
export default function parseHydraDocumentation(
  entrypointUrl: string,
  options: RequestInitExtended = {}
): Promise<{
  api: OpenAPIV3.Document;
  response: Response;
  status: number;
}> {
  entrypointUrl = removeTrailingSlash(entrypointUrl);

  return fetchEntrypointAndDocs(entrypointUrl, options).then(
    ({ entrypoint, docs, response }) => {
      const entrypointType = <string>get(entrypoint, '[0]["@type"][0]') || undefined;
      if (!entrypointType) {
        throw new Error('The API entrypoint has no "@type" key.');
      }

      const entrypointClass = findSupportedClass(docs, entrypointType);
      if (!Array.isArray(entrypointClass["http://www.w3.org/ns/hydra/core#supportedProperty"])) {
        throw new Error('The entrypoint definition has no "http://www.w3.org/ns/hydra/core#supportedProperty" key or it is not an array.');
      }

      const paths = <OpenAPIV3.PathsObject>{};

      for (const properties of entrypointClass["http://www.w3.org/ns/hydra/core#supportedProperty"]) {
        const property = <RdfProperty>(get(properties, '["http://www.w3.org/ns/hydra/core#property"][0]')) || undefined;
        if (!property) {
          continue;
        }

        const url = new URL(<string>get(entrypoint, `[0]["${property["@id"]}"][0]["@id"]`)) || undefined;
        if (!url) {
          throw new Error(`Unable to find the URL for "${property["@id"]}", make sure your api resource has at least one GET item operation declared.`);
        }

        if (property["http://www.w3.org/ns/hydra/core#supportedOperation"]) {
          const collectionPath = <OpenAPIV3.PathItemObject>{};

          for (const entrypointOperation of property["http://www.w3.org/ns/hydra/core#supportedOperation"]) {
            if (!entrypointOperation["http://www.w3.org/ns/hydra/core#returns"]) {
              continue;
            }

            switch (entrypointOperation["http://www.w3.org/ns/hydra/core#method"][0]["@value"]) {
              case 'GET':
                collectionPath.get = <OpenAPIV3.OperationObject>{
                  summary: entrypointOperation["http://www.w3.org/ns/hydra/core#title"][0]["@value"],
                  responses: <OpenAPIV3.ResponsesObject>{
                    200: <OpenAPIV3.ResponseObject>{
                      description: "Description", // Not available in hydra
                    },
                  },
                };
                break;
              case 'POST':
                collectionPath.post = <OpenAPIV3.OperationObject>{
                  summary: entrypointOperation["http://www.w3.org/ns/hydra/core#title"][0]["@value"],
                  responses: <OpenAPIV3.ResponsesObject>{
                    201: <OpenAPIV3.ResponseObject>{
                      description: "Description", // Not available in hydra
                    },
                  },
                };
                break;
              default:
                // TODO
                break;
            }
          }

          paths[url.pathname] = collectionPath;
        }

        const relatedClass = findRelatedClass(docs, property);
        if (relatedClass["http://www.w3.org/ns/hydra/core#supportedOperation"]) {
          const itemPath = <OpenAPIV3.PathItemObject>{};

          for (const supportedOperation of relatedClass["http://www.w3.org/ns/hydra/core#supportedOperation"]) {
            if (!supportedOperation["http://www.w3.org/ns/hydra/core#returns"]) {
              continue;
            }

            switch (supportedOperation["http://www.w3.org/ns/hydra/core#method"][0]["@value"]) {
              case 'GET':
                itemPath.get = <OpenAPIV3.OperationObject>{
                  summary: supportedOperation["http://www.w3.org/ns/hydra/core#title"][0]["@value"],
                  responses: <OpenAPIV3.ResponsesObject>{
                    200: <OpenAPIV3.ResponseObject>{
                      description: "Description", // Not available in hydra
                    },
                  },
                };
                break;
              case 'POST':
                itemPath.post = <OpenAPIV3.OperationObject>{
                  summary: supportedOperation["http://www.w3.org/ns/hydra/core#title"][0]["@value"],
                  responses: <OpenAPIV3.ResponsesObject>{
                    201: <OpenAPIV3.ResponseObject>{
                      description: "Description", // Not available in hydra
                    },
                  },
                };
                break;
              case 'DELETE':
                itemPath.delete = <OpenAPIV3.OperationObject>{
                  summary: supportedOperation["http://www.w3.org/ns/hydra/core#title"][0]["@value"],
                  responses: <OpenAPIV3.ResponsesObject>{
                    204: <OpenAPIV3.ResponseObject>{
                      description: "Description", // Not available in hydra
                    },
                  },
                };
                break;
              default:
                // TODO
                break;
            }
          }

          paths[`${url.pathname}/{id}`] = itemPath;
        }
      }

      return {
        api: <OpenAPIV3.Document>{
          openapi: "3.0.3",
          info: <OpenAPIV3.InfoObject>{
            title: <string>(get(docs, '[0]["http://www.w3.org/ns/hydra/core#title"][0]["@value"]', "Title")),
            description: <string>(get(docs, '[0]["http://www.w3.org/ns/hydra/core#description"][0]["@value"]', "Description")),
            version: "NA", // Not available in hydra
          },
          paths: paths,
        },
        response,
        status: response.status,
      };
    },
    (data: { response: Response }) =>
      Promise.reject({
        api: <OpenAPIV3.Document>{},
        error: data,
        response: data.response,
        status: get(data.response, "status"),
      })
  );
}
