import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
  } from "graphql";

export const ImpuestosType = new GraphQLObjectType({
    name: "Impuestos",
    description: "Impuestos type",
    fields: () => ({
      id: { type: GraphQLID },
      impuesto: { type: GraphQLString },
      responsabilidad: { type: GraphQLInt },
      comentario: { type: GraphQLString },
    }),
  });
  