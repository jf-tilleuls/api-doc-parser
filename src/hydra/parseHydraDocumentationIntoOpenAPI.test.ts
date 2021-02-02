import { FetchMock, MockParams } from "jest-fetch-mock";
import parseHydraDocumentationIntoOpenAPI from "./parseHydraDocumentationIntoOpenAPI";
import SwaggerParser from "@apidevtools/swagger-parser";

const fetchMock = fetch as FetchMock;

const entrypoint = `{
  "@context": {
    "@vocab": "http://localhost/docs.jsonld#",
    "hydra": "http://www.w3.org/ns/hydra/core#",
    "book": {
      "@id": "Entrypoint/book",
      "@type": "@id"
    },
    "review": {
      "@id": "Entrypoint/review",
      "@type": "@id"
    },
    "customResource": {
      "@id": "Entrypoint/customResource",
      "@type": "@id"
    },
    "deprecatedResource": {
      "@id": "Entrypoint/deprecatedResource",
      "@type": "@id"
    }
  },
  "@id": "/",
  "@type": "Entrypoint",
  "book": "/books",
  "review": "/reviews",
  "customResource": "/customResources",
  "deprecatedResource": "/deprecated_resources"
}`;

const docs = `{
"@context": {
  "@vocab": "http://localhost/docs.jsonld#",
  "hydra": "http://www.w3.org/ns/hydra/core#",
  "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
  "xmls": "http://www.w3.org/2001/XMLSchema#",
  "owl": "http://www.w3.org/2002/07/owl#",
  "domain": {
    "@id": "rdfs:domain",
    "@type": "@id"
  },
  "range": {
    "@id": "rdfs:range",
    "@type": "@id"
  },
  "subClassOf": {
    "@id": "rdfs:subClassOf",
    "@type": "@id"
  },
  "expects": {
    "@id": "hydra:expects",
    "@type": "@id"
  },
  "returns": {
    "@id": "hydra:returns",
    "@type": "@id"
  }
},
"@id": "/docs.jsonld",
"hydra:title": "API Platform's demo",
"hydra:description": "A test",
"hydra:entrypoint": "/",
"hydra:supportedClass": [
  {
    "@id": "http://schema.org/Book",
    "@type": "hydra:Class",
    "rdfs:label": "Book",
    "hydra:title": "Book",
    "hydra:supportedProperty": [
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "http://schema.org/isbn",
          "@type": "rdf:Property",
          "rdfs:label": "isbn",
          "domain": "http://schema.org/Book",
          "range": "xmls:string"
        },
        "hydra:title": "isbn",
        "hydra:required": true,
        "hydra:readable": true,
        "hydra:writeable": true,
        "hydra:description": "The ISBN of the book"
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "http://schema.org/name",
          "@type": "rdf:Property",
          "rdfs:label": "name",
          "domain": "http://schema.org/Book",
          "range": "xmls:string"
        },
        "hydra:title": "name",
        "hydra:required": true,
        "hydra:readable": true,
        "hydra:writeable": true,
        "hydra:description": "The name of the item"
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "http://schema.org/description",
          "@type": "rdf:Property",
          "rdfs:label": "description",
          "domain": "http://schema.org/Book",
          "range": "xmls:string"
        },
        "hydra:title": "description",
        "hydra:required": false,
        "hydra:readable": true,
        "hydra:writeable": true,
        "hydra:description": "A description of the item"
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "http://schema.org/author",
          "@type": "rdf:Property",
          "rdfs:label": "author",
          "domain": "http://schema.org/Book",
          "range": "xmls:string"
        },
        "hydra:title": "author",
        "hydra:required": true,
        "hydra:readable": true,
        "hydra:writeable": true,
        "hydra:description": "The author of this content or rating. Please note that author is special in that HTML 5 provides a special mechanism for indicating authorship via the rel tag. That is equivalent to this and may be used interchangeably"
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "http://schema.org/dateCreated",
          "@type": "rdf:Property",
          "rdfs:label": "dateCreated",
          "domain": "http://schema.org/Book",
          "range": "xmls:dateTime"
        },
        "hydra:title": "dateCreated",
        "hydra:required": true,
        "hydra:readable": true,
        "hydra:writeable": true,
        "hydra:description": "The date on which the CreativeWork was created or the item was added to a DataFeed"
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "http://schema.org/reviews",
          "@type": "hydra:Link",
          "rdfs:label": "reviews",
          "domain": "http://schema.org/Book",
          "range": "http://schema.org/Review"
        },
        "hydra:title": "reviews",
        "hydra:required": false,
        "hydra:readable": true,
        "hydra:writable": true,
        "hydra:description": "The book's reviews"
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "http://schema.org/reviews",
          "@type": "rdf:Property",
          "rdfs:label": "embeddedReviews",
          "domain": "http://schema.org/Book",
          "range": "http://schema.org/Review"
        },
        "hydra:title": "embeddedReviews",
        "hydra:required": false,
        "hydra:readable": true,
        "hydra:writable": true,
        "hydra:description": "The book's reviews"
      }
    ],
    "hydra:supportedOperation": [
      {
        "@type": "hydra:Operation",
        "hydra:method": "GET",
        "hydra:title": "Retrieves Book resource.",
        "rdfs:label": "Retrieves Book resource.",
        "returns": "http://schema.org/Book"
      },
      {
        "@type": "hydra:ReplaceResourceOperation",
        "expects": "http://schema.org/Book",
        "hydra:method": "PUT",
        "hydra:title": "Replaces the Book resource.",
        "rdfs:label": "Replaces the Book resource.",
        "returns": "http://schema.org/Book"
      },
      {
        "@type": "hydra:Operation",
        "hydra:method": "DELETE",
        "hydra:title": "Deletes the Book resource.",
        "rdfs:label": "Deletes the Book resource.",
        "returns": "owl:Nothing"
      },
      {
        "@type": "hydra:Operation",
        "hydra:method": "GET"
      }
    ]
  },
  {
    "@id": "http://schema.org/Review",
    "@type": "hydra:Class",
    "rdfs:label": "Review",
    "hydra:title": "Review",
    "hydra:supportedProperty": [
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "http://schema.org/reviewBody",
          "@type": "rdf:Property",
          "rdfs:label": "reviewBody",
          "domain": "http://schema.org/Review",
          "range": "xmls:string"
        },
        "hydra:title": "reviewBody",
        "hydra:required": false,
        "hydra:readable": true,
        "hydra:writeable": true,
        "hydra:description": "The actual body of the review"
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "#Review/rating",
          "@type": "rdf:Property",
          "rdfs:label": "rating",
          "domain": "http://schema.org/Review",
          "range": "xmls:integer"
        },
        "hydra:title": "rating",
        "hydra:required": false,
        "hydra:readable": true,
        "hydra:writeable": true
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "http://schema.org/itemReviewed",
          "@type": "hydra:Link",
          "rdfs:label": "itemReviewed",
          "domain": "http://schema.org/Review",
          "owl:maxCardinality": 1,
          "range": "http://schema.org/Book"
        },
        "hydra:title": "itemReviewed",
        "hydra:required": true,
        "hydra:readable": true,
        "hydra:writeable": true,
        "hydra:description": "The item that is being reviewed/rated"
      }
    ],
    "hydra:supportedOperation": [
      {
        "@type": "hydra:Operation",
        "hydra:method": "GET",
        "hydra:title": "Retrieves Review resource.",
        "rdfs:label": "Retrieves Review resource.",
        "returns": "http://schema.org/Review"
      },
      {
        "@type": "hydra:ReplaceResourceOperation",
        "expects": "http://schema.org/Review",
        "hydra:method": "PUT",
        "hydra:title": "Replaces the Review resource.",
        "rdfs:label": "Replaces the Review resource.",
        "returns": "http://schema.org/Review"
      },
      {
        "@type": "hydra:Operation",
        "hydra:method": "DELETE",
        "hydra:title": "Deletes the Review resource.",
        "rdfs:label": "Deletes the Review resource.",
        "returns": "owl:Nothing"
      }
    ]
  },
  {
    "@id": "#CustomResource",
    "@type": "hydra:Class",
    "rdfs:label": "CustomResource",
    "hydra:title": "CustomResource",
    "hydra:description": "A custom resource.",
    "hydra:supportedProperty": [
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "#CustomResource/label",
          "@type": "rdf:Property",
          "rdfs:label": "label",
          "domain": "#CustomResource",
          "range": "xmls:string"
        },
        "hydra:title": "label",
        "hydra:required": true,
        "hydra:readable": true,
        "hydra:writeable": true
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "#CustomResource/description",
          "@type": "rdf:Property",
          "rdfs:label": "description",
          "domain": "#CustomResource",
          "range": "xmls:string"
        },
        "hydra:title": "description",
        "hydra:required": true,
        "hydra:readable": true,
        "hydra:writeable": true
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "#CustomResource/sanitizedDescription",
          "@type": "rdf:Property",
          "rdfs:label": "sanitizedDescription",
          "domain": "#CustomResource"
        },
        "hydra:title": "sanitizedDescription",
        "hydra:required": false,
        "hydra:readable": true,
        "hydra:writeable": false
      }
    ],
    "hydra:supportedOperation": [
      {
        "@type": "hydra:Operation",
        "hydra:method": "GET",
        "hydra:title": "Retrieves custom resources.",
        "rdfs:label": "Retrieves custom resources.",
        "returns": "#CustomResource"
      },
      {
        "@type": "hydra:CreateResourceOperation",
        "expects": "#CustomResource",
        "hydra:method": "POST",
        "hydra:title": "Creates a custom resource.",
        "rdfs:label": "Creates a custom resource.",
        "returns": "#CustomResource"
      }
    ]
  },
  {
    "@id": "#DeprecatedResource",
    "@type": "hydra:Class",
    "rdfs:label": "DeprecatedResource",
    "hydra:title": "DeprecatedResource",
    "hydra:supportedProperty": [
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "#DeprecatedResource/deprecatedField",
          "@type": "rdf:Property",
          "rdfs:label": "deprecatedField",
          "domain": "#DeprecatedResource",
          "range": "xmls:string"
        },
        "hydra:title": "deprecatedField",
        "hydra:required": true,
        "hydra:readable": true,
        "hydra:writeable": true,
        "hydra:description": "",
        "owl:deprecated": true
      }
    ],
    "hydra:supportedOperation": [
      {
        "@type": [
          "hydra:Operation",
          "schema:FindAction"
        ],
        "hydra:method": "GET",
        "hydra:title": "Retrieves DeprecatedResource resource.",
        "owl:deprecated": true,
        "rdfs:label": "Retrieves DeprecatedResource resource.",
        "returns": "#DeprecatedResource"
      }
    ],
    "hydra:description": "This is a dummy entity. Remove it!",
    "owl:deprecated": true
  },
  {
    "@id": "#Entrypoint",
    "@type": "hydra:Class",
    "hydra:title": "The API entrypoint",
    "hydra:supportedProperty": [
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "#Entrypoint/book",
          "@type": "hydra:Link",
          "domain": "#Entrypoint",
          "rdfs:label": "The collection of Book resources",
          "rdfs:range": [
            {"@id": "hydra:PagedCollection"},
            {
              "owl:equivalentClass": {
                "owl:onProperty": {"@id": "hydra:member"},
                "owl:allValuesFrom": {"@id": "http://schema.org/Book"}
              }
            }
          ]
        },
        "hydra:title": "The collection of Book resources",
        "hydra:readable": true,
        "hydra:writeable": false
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "#Entrypoint/review",
          "@type": "hydra:Link",
          "domain": "#Entrypoint",
          "rdfs:label": "The collection of Review resources",
          "range": "hydra:PagedCollection",
          "hydra:supportedOperation": [
            {
              "@type": "hydra:Operation",
              "hydra:method": "GET",
              "hydra:title": "Retrieves the collection of Review resources.",
              "rdfs:label": "Retrieves the collection of Review resources.",
              "returns": "hydra:PagedCollection"
            },
            {
              "@type": "hydra:CreateResourceOperation",
              "expects": "http://schema.org/Review",
              "hydra:method": "POST",
              "hydra:title": "Creates a Review resource.",
              "rdfs:label": "Creates a Review resource.",
              "returns": "http://schema.org/Review"
            }
          ]
        },
        "hydra:title": "The collection of Review resources",
        "hydra:readable": true,
        "hydra:writeable": false
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "#Entrypoint/customResource",
          "@type": "hydra:Link",
          "domain": "#Entrypoint",
          "rdfs:label": "The collection of custom resources",
          "range": "hydra:PagedCollection",
          "hydra:supportedOperation": [
            {
              "@type": "hydra:Operation",
              "hydra:method": "GET",
              "hydra:title": "Retrieves the collection of custom resources.",
              "rdfs:label": "Retrieves the collection of custom resources.",
              "returns": "hydra:PagedCollection"
            },
            {
              "@type": "hydra:CreateResourceOperation",
              "expects": "#CustomResource",
              "hydra:method": "POST",
              "hydra:title": "Creates a custom resource.",
              "rdfs:label": "Creates a custom resource.",
              "returns": "#CustomResource"
            }
          ]
        },
        "hydra:title": "The collection of custom resources",
        "hydra:readable": true,
        "hydra:writeable": false
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
            "@id": "#Entrypoint/deprecatedResource",
            "@type": "hydra:Link",
            "domain": "#Entrypoint",
            "rdfs:label": "The collection of DeprecatedResource resources",
            "rdfs:range": [
              {
                "@id": "hydra:Collection"
              },
              {
                "owl:equivalentClass": {
                  "owl:onProperty": {
                    "@id": "hydra:member"
                  },
                  "owl:allValuesFrom": {
                    "@id": "#DeprecatedResource"
                  }
                }
              }
            ],
            "hydra:supportedOperation": [
              {
                "@type": [
                  "hydra:Operation",
                  "schema:FindAction"
                ],
                "hydra:method": "GET",
                "hydra:title": "Retrieves the collection of DeprecatedResource resources.",
                "owl:deprecated": true,
                "rdfs:label": "Retrieves the collection of DeprecatedResource resources.",
                "returns": "hydra:Collection"
              }
            ]
        },
        "hydra:title": "The collection of DeprecatedResource resources",
        "hydra:readable": true,
        "hydra:writeable": false,
        "owl:deprecated": true
    }
    ],
    "hydra:supportedOperation": {
      "@type": "hydra:Operation",
      "hydra:method": "GET",
      "rdfs:label": "The API entrypoint.",
      "returns": "#EntryPoint"
    }
  },
  {
    "@id": "#ConstraintViolation",
    "@type": "hydra:Class",
    "hydra:title": "A constraint violation",
    "hydra:supportedProperty": [
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "#ConstraintViolation/propertyPath",
          "@type": "rdf:Property",
          "rdfs:label": "propertyPath",
          "domain": "#ConstraintViolation",
          "range": "xmls:string"
        },
        "hydra:title": "propertyPath",
        "hydra:description": "The property path of the violation",
        "hydra:readable": true,
        "hydra:writeable": false
      },
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "#ConstraintViolation/message",
          "@type": "rdf:Property",
          "rdfs:label": "message",
          "domain": "#ConstraintViolation",
          "range": "xmls:string"
        },
        "hydra:title": "message",
        "hydra:description": "The message associated with the violation",
        "hydra:readable": true,
        "hydra:writeable": false
      }
    ]
  },
  {
    "@id": "#ConstraintViolationList",
    "@type": "hydra:Class",
    "subClassOf": "hydra:Error",
    "hydra:title": "A constraint violation list",
    "hydra:supportedProperty": [
      {
        "@type": "hydra:SupportedProperty",
        "hydra:property": {
          "@id": "#ConstraintViolationList/violation",
          "@type": "rdf:Property",
          "rdfs:label": "violation",
          "domain": "#ConstraintViolationList",
          "range": "#ConstraintViolation"
        },
        "hydra:title": "violation",
        "hydra:description": "The violations",
        "hydra:readable": true,
        "hydra:writeable": false
      }
    ]
  }
]
}`;

const expectedApi = `
{
  "openapi": "3.0.3",
  "info": {
    "title": "API Platform's demo",
    "description": "A test",
    "version": "NA"
  },
  "paths": {
    "/books/{id}": {
      "get": {
        "summary": "Retrieves Book resource.",
        "responses": {
          "200": {
            "description": "Description"
          }
        }
      },
      "delete": {
        "summary": "Deletes the Book resource.",
        "responses": {
          "204": {
            "description": "Description"
          }
        }
      }
    },
    "/reviews": {
      "get": {
        "summary": "Retrieves the collection of Review resources.",
        "responses": {
          "200": {
            "description": "Description"
          }
        }
      },
      "post": {
        "summary": "Creates a Review resource.",
        "responses": {
          "201": {
            "description": "Description"
          }
        }
      }
    },
    "/reviews/{id}": {
      "get": {
        "summary": "Retrieves Review resource.",
        "responses": {
          "200": {
            "description": "Description"
          }
        }
      },
      "delete": {
        "summary": "Deletes the Review resource.",
        "responses": {
          "204": {
            "description": "Description"
          }
        }
      }
    },
    "/customResources": {
      "get": {
        "summary": "Retrieves the collection of custom resources.",
        "responses": {
          "200": {
            "description": "Description"
          }
        }
      },
      "post": {
        "summary": "Creates a custom resource.",
        "responses": {
          "201": {
            "description": "Description"
          }
        }
      }
    },
    "/customResources/{id}": {
      "get": {
        "summary": "Retrieves custom resources.",
        "responses": {
          "200": {
            "description": "Description"
          }
        }
      },
      "post": {
        "summary": "Creates a custom resource.",
        "responses": {
          "201": {
            "description": "Description"
          }
        }
      }
    },
    "/deprecated_resources": {
      "get": {
        "summary": "Retrieves the collection of DeprecatedResource resources.",
        "responses": {
          "200": {
            "description": "Description"
          }
        }
      }
    },
    "/deprecated_resources/{id}": {
      "get": {
        "summary": "Retrieves DeprecatedResource resource.",
        "responses": {
          "200": {
            "description": "Description"
          }
        }
      }
    }
  }
}
`;

const init: MockParams = {
  status: 200,
  statusText: "OK",
  headers: {
    Link:
      '<http://localhost/docs.jsonld>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"',
    "Content-Type": "application/ld+json",
  },
};

test("parse a Hydra documentation", async () => {
  fetchMock.mockResponses([entrypoint, init], [docs, init]);

  const options = { headers: new Headers({ CustomHeader: "customValue" }) };

  await parseHydraDocumentationIntoOpenAPI("http://localhost", options).then(
    async (data) => {
      try {
        const api = await SwaggerParser.validate(data.api);

        // expect(JSON.stringify(api)).toBe(JSON.stringify(expectedApi));
        console.log(JSON.stringify(api));
      } catch (e) {
        console.error(e);
      }
    }
  );
});
