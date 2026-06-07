import SchemaBuilder from '@pothos/core';
import { User, Product, getProductById, searchProducts } from './data';

export const builder = new SchemaBuilder<{
  Objects: { Product: Product };
}>({});

builder.objectType(User, {
  name: 'User',
  fields: t => ({
    id: t.exposeID('id'),
    firstName: t.exposeString('firstName'),
    lastName: t.exposeString('lastName'),
    fullName: t.string({
      resolve: user => `${user.firstName} ${user.lastName}`,
    }),
  }),
});

const ProductRef = builder.objectRef<Product>('Product');
ProductRef.implement({
  fields: t => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    price: t.exposeFloat('price'),
    category: t.exposeString('category'),
    imageUrl: t.exposeString('imageUrl'),
    stock: t.exposeInt('stock'),
    createdAt: t.exposeString('createdAt'),
  }),
});

builder.queryType({
  fields: t => ({
    user: t.field({
      type: User,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (_root, args) => new User(args.id),
    }),

    product: t.field({
      type: ProductRef,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (_root, args) => {
        console.log('product resolver called with id:', args.id);
        return getProductById(args.id) ?? null;
      },
    }),

    searchProducts: t.field({
      type: [ProductRef],
      args: {
        query: t.arg.string({ required: true }),
      },
      resolve: (_root, args) => {
        console.log('searchProducts resolver called with:', args);
        return searchProducts(args.query);
      },
    }),

    products: t.field({
      type: [ProductRef],
      args: {
        ids: t.arg.idList({ required: true }),
      },
      resolve: (_root, args) => {
        const results: Product[] = [];
        for (const id of args.ids) {
          const product = getProductById(id);
          if (product) results.push(product);
        }
        return results;
      },
    }),
  }),
});

export const schema = builder.toSchema();
