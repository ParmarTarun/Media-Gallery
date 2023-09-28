import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import SingleOrder from "@/components/SingleOrder";
import ProductBox from "@/components/ProductBox";
import Spinner from "@/components/Spinner";
import Tabs from "@/components/Tabs";
import WhiteBox from "@/components/WhiteBox";
import { wishedProductSchemaType } from "@/models/WishedProduct";
import { orderSchemaType } from "@/models/order";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  margin: 40px 0;
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const AccountsPage = () => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [streetAdd, setStreetAdd] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressLaoded, setAddressLoaded] = useState(true);
  const [listLoaded, setListLoaded] = useState(true);
  const [ordersLoaded, setOrdersLoaded] = useState(true);
  const [activeTab, setActiveTab] = useState("Orders");
  const [wishedProducts, setWishedProducts] = useState<
    wishedProductSchemaType[]
  >([]);
  const [orders, setOrders] = useState<orderSchemaType[]>([]);

  useEffect(() => {
    if (!session) return;
    setAddressLoaded(false);
    axios
      .get("/api/address")
      .then((res) => {
        setName(res.data.name);
        setEmail(res.data.email);
        setPostalCode(res.data.postalCode);
        setStreetAdd(res.data.streetAdd);
        setCity(res.data.city);
      })
      .finally(() => setAddressLoaded(true));
    setListLoaded(false);
    axios
      .get("/api/wishlist")
      .then((res) => setWishedProducts(res.data))
      .finally(() => setListLoaded(true));
    setOrdersLoaded(false);
    axios
      .get("/api/orders")
      .then((res) => setOrders(res.data))
      .finally(() => setOrdersLoaded(true));
  }, [session]);

  const removedFromWishlist = (pId: string) => {
    if (pId === "") return;
    const updatedProducts = wishedProducts.filter(
      (wp) => wp.product._id?.toString() !== pId
    );
    setWishedProducts(updatedProducts);
  };

  const saveAddress = () => {
    const data = { name, email, city, streetAdd, postalCode };
    axios.put("/api/address", data).then((res) => alert("Address Updated"));
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };
  const login = async () => {
    await signIn("google");
  };

  return (
    <>
      <Header />
      <Center>
        <>
          <ColsWrapper>
            <RevealWrapper delay={100}>
              <WhiteBox>
                <Tabs
                  tabs={["Orders", "Wishlist"]}
                  activeTab={activeTab}
                  onTabClick={(p) => setActiveTab(p)}
                />
                {activeTab === "Wishlist" && (
                  <>
                    {!listLoaded && <Spinner />}
                    {listLoaded && (
                      <>
                        <WishedProductsGrid>
                          {wishedProducts.map((wp, i) => (
                            <ProductBox
                              key={i}
                              product={wp.product}
                              wished={true}
                              onRemove={() =>
                                removedFromWishlist(
                                  wp.product._id?.toString() || ""
                                )
                              }
                            />
                          ))}
                        </WishedProductsGrid>
                        {wishedProducts.length === 0 && (
                          <div style={{ marginLeft: "15px" }}>
                            {session && <p>Your wishlist is empty</p>}
                            {!session && <p>Login to create a wishlist</p>}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
                {activeTab === "Orders" && (
                  <>
                    {!ordersLoaded && <Spinner />}
                    {ordersLoaded && (
                      <>
                        {orders.map((order, i) => (
                          <SingleOrder key={i} {...order}></SingleOrder>
                        ))}
                        {orders.length === 0 && (
                          <div style={{ marginLeft: "15px" }}>
                            {session && <p>Place an order to see here</p>}
                            {!session && <p>Login to see your orders</p>}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </WhiteBox>
            </RevealWrapper>
            <RevealWrapper delay={100}>
              <WhiteBox>
                <h2>{session ? "Account Details" : "Login"}</h2>
                {!addressLaoded && <Spinner />}
                {addressLaoded && session && (
                  <>
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
                    <Button block primary onClick={saveAddress}>
                      <>SAVE</>
                    </Button>
                    <hr />
                  </>
                )}
                {session && (
                  <Button primary={true} onClick={logout}>
                    <>Logout</>
                  </Button>
                )}
                {!session && (
                  <Button primary={true} onClick={login}>
                    <>Login with Google</>
                  </Button>
                )}
              </WhiteBox>
            </RevealWrapper>
          </ColsWrapper>
        </>
      </Center>
    </>
  );
};

export default AccountsPage;
