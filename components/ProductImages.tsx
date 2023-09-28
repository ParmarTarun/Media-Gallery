import React, { useState } from "react";
import styled from "styled-components";

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;
const BigImageWrapper = styled.div`
  text-align: center;
`;
const BigImage = styled.img`
  max-width: 100%;
  max-height: 200px;
`;
const ImageButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-grow: 0;
  margin-top: 10px;
`;
const ImageButton = styled.div`
  border: 2px solid #ccc;
  height: 40px;
  cursor: pointer;
`;

interface ProductImagesProp {
  images: string[];
}

const ProductImages = ({ images }: ProductImagesProp) => {
  const [activeImage, setActiveImage] = useState(images?.[0]);

  return (
    <>
      <BigImageWrapper>
        <BigImage src={activeImage} alt="" />
      </BigImageWrapper>
      <ImageButtons>
        {images.map((image, i) => (
          <ImageButton
            key={i}
            style={{ opacity: image === activeImage ? "1" : "0.5" }}
            onClick={() => setActiveImage(images[i])}
          >
            <Image src={image} alt="" />
          </ImageButton>
        ))}
      </ImageButtons>
    </>
  );
};

export default ProductImages;
