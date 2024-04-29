import React from "react";
import Plus from "./images/plus.png";

export function ProductCard({ product, category, productCategory, addToCart }) {
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="prodContainer">
      <div className="row justify-content-center h-50">
        {product.map((product) => (
          <div key={product.productId} className="col-md-4 col-sm-6 card my-3 broder-0">
            <div className="card-img-top text-center">
              <img src={product.image} alt="" className="imagesp" />
            </div>
            <div className={product.quantityInStock === 0 ? "card-body out-of-stock" : "card-body"}>
              <div className="card-title fw-bold fs-4">
                {product.productName}
                <br />
                {product.price}$
              </div>
              <div className="card-text">
                {product.manufacturer}
                <br />
                {product.quantityInStock} left
                <div>
                  <p className="fw-bold">Categories:</p>
                  {category
                    .filter((cat) => {
                      return productCategory.some((pCat) => pCat.categoryId === cat.categoryId && pCat.productId === product.productId);
                    })
                    .map((cat) => (
                      <div key={cat.categoryId}> {cat.categoryName}</div>
                    ))}
                </div>
              </div>
              {product.quantityInStock > 0 && (
                <div>
                  <img onClick={() => handleAddToCart(product)} className="add-to-cart" src={Plus} />
                </div>
              )}
              {product.quantityInStock <= 0 && (
                <div>
                 <p className="out-of-stock2">Out of stock!</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
