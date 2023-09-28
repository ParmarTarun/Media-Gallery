import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Table from "@/components/Table";
import { productSchemaType } from "@/models/product";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { ObjectId } from "mongodb";
import Input from "@/components/Input";
import WhiteBox from "@/components/WhiteBox";
import { RevealWrapper } from "next-reveal";
import { useSession } from "next-auth/react";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.3fr 0.7fr;
  }
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 100px;
  height: 100px;
  padding: 2px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 80px;
    max-height: 80px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
  }
`;

const QuantityLabel = styled.span`
  padding: 0 3px;
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const CartPage = () => {
  const { data: session } = useSession();
  const { cartProductIds, addProductToCart, removeProductFromCart, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState<productSchemaType[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [streetAdd, setStreetAdd] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const updateQuantity = (id: ObjectId, increase: boolean) => {
    if (increase) addProductToCart(id);
    else removeProductFromCart(id);
  };

  const goToPayment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const data = { name, email, city, postalCode, streetAdd, cartProductIds };
    await axios
      .post("/api/checkout", data)
      .then((res) => {
        if (res.data.url) window.location = res.data.url;
      })
      .catch((e) => {
        alert("Something went wrong!");
        console.log(e);
      });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window?.location.href.includes("success")) {
      setIsSuccess(true);
      clearCart();
    }
    if (session)
      axios.get("/api/address").then((res) => {
        setName(res.data.name);
        setEmail(res.data.email);
        setPostalCode(res.data.postalCode);
        setStreetAdd(res.data.streetAdd);
        setCity(res.data.city);
      });
  }, []);

  useEffect(() => {
    if (cartProductIds.length > 0) {
      axios
        .post("/api/cart", { ids: cartProductIds })
        .then((res) => setProducts(res.data));
    } else {
      setProducts([]);
    }
  }, [cartProductIds]);

  let totalPrice = 0;
  for (const id of cartProductIds) {
    totalPrice += products.find((prod) => prod._id === id)?.price || 0;
  }

  if (isSuccess)
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <WhiteBox>
              <h1>Thank you for your order!</h1>
              <p>We will email you when your order is sent</p>
            </WhiteBox>
          </ColumnsWrapper>
        </Center>
      </>
    );

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <RevealWrapper delay={100}>
            <WhiteBox>
              <h2>Cart</h2>
              {!cartProductIds?.length && <div>Your cart is empty</div>}
              {products?.length > 0 && (
                <Table>
                  <>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {products.map((prod, i) => (
                          <tr key={i}>
                            <ProductInfoCell>
                              <ProductImageBox>
                                <img src={prod.images[0]} alt="" />
                              </ProductImageBox>
                              {prod.title}
                            </ProductInfoCell>
                            <td>
                              <Button
                                whiteOnWhite
                                onClick={() =>
                                  updateQuantity(prod._id as ObjectId, false)
                                }
                              >
                                <>-</>
                              </Button>
                              <QuantityLabel>
                                {
                                  cartProductIds.filter((id) => prod._id === id)
                                    .length
                                }
                              </QuantityLabel>
                              <Button
                                whiteOnWhite
                                onClick={() =>
                                  updateQuantity(prod._id as ObjectId, true)
                                }
                              >
                                <>+</>
                              </Button>
                            </td>
                            <td>
                              $
                              {prod.price *
                                cartProductIds.filter((id) => prod._id === id)
                                  .length}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td></td>
                          <td></td>
                          <td>${totalPrice}</td>
                        </tr>
                      </>
                    </tbody>
                  </>
                </Table>
              )}
            </WhiteBox>
          </RevealWrapper>
          {!!cartProductIds?.length && (
            <RevealWrapper delay={100}>
              <WhiteBox>
                <>
                  <h2>Order Details</h2>
                  <form>
                    <Input
                      type="text"
                      placeholder="Name"
                      value={name}
                      name="name"
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Email"
                      value={email}
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Street Address"
                      value={streetAdd}
                      name="streetAdd"
                      onChange={(e) => setStreetAdd(e.target.value)}
                    />
                    <CityHolder>
                      <Input
                        type="text"
                        placeholder="City"
                        value={city}
                        name="city"
                        onChange={(e) => setCity(e.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Postal Code"
                        value={postalCode}
                        name="postalCode"
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </CityHolder>
                    <Button block primary onClick={(e) => goToPayment(e)}>
                      <>Continue to payment</>
                    </Button>
                  </form>
                </>
              </WhiteBox>
            </RevealWrapper>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
};

export default CartPage;
