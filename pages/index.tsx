import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { WishedProduct } from "@/models/WishedProduct";
import { Product, productSchemaType } from "@/models/product";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

interface homePageProps {
  featuredProduct: productSchemaType;
  newProducts: productSchemaType[];
  wishedNewProductIds: string[];
}

const HomePage = ({
  featuredProduct,
  newProducts,
  wishedNewProductIds,
}: homePageProps) => {
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts
        products={newProducts}
        wishedNewProductIds={wishedNewProductIds}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<homePageProps> = async (
  ctx
) => {
  const featuredId = "651d7afe0bac064edaf90a0e";
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredId);
  const newProducts = await Product.find({}, null, { sort: { _id: -1 } });
  const sessionData = await getServerSession(ctx.req, ctx.res, authOptions);
  let wishedNewProductsIds: string[] = [];
  if (sessionData) {
    const { user } = sessionData;
    const wishedNewProducts = user
      ? await WishedProduct.find({
          userEmail: user?.email,
          product: newProducts.map((prod) => prod._id.toString()),
        })
      : [];
    wishedNewProductsIds = wishedNewProducts.map((row) =>
      row.product.toString()
    );
  }

  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      wishedNewProductIds: wishedNewProductsIds,
    },
  };
};

export default HomePage;
