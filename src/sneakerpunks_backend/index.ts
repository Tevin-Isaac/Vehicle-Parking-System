import {
  query,
  update,
  text,
  Principal,
  Result,
  Variant,
  Vec,
  nat64,
  StableBTreeMap,
  None,
  Some,
  Ok,
  Err,
  Canister
} from "azle";

// Interface for the ERC20 token, in our case USD
interface IERC20Token {
  transfer(to: Principal, amount: nat64): Promise<undefined>;

  approve(spender: Principal, amount: nat64): Promise<undefined>;

  transferFrom(from: Principal, to: Principal, amount: nat64): Promise<undefined>;

  totalSupply(): Promise<nat64>;

  balanceOf(owner: Principal): Promise<nat64>;

  allowance(owner: Principal, spender: Principal): Promise<nat64>;
}

// Contract for the marketplace
const Marketplace = Canister({

  productsLength: 0n,
  UsdTokenAddress: Principal.fromText("rwlgt-iiaaa-aaaaa-aaaaa-cai"),

  Product: Record({
      owner: Principal,
      name: text,
      image: text,
      description: text,
      location: text,
      price: nat64,
      sold: nat64
  }),

  products: StableBTreeMap(0, nat64, Product),

  writeProduct: update(
      [text, text, text, text, nat64],
      Result(nat64, text),
      async (_name, _image, _description, _location, _price) => {
          const sold = 0n;
          const owner = ic.caller();
          const productId = Marketplace.productsLength;
          const product = {
              owner,
              name: _name,
              image: _image,
              description: _description,
              location: _location,
              price: _price,
              sold
          };
          Marketplace.products.insert(productId, product);
          Marketplace.productsLength += 1n;
          return Ok(productId);
      }
  ),

  editProduct: update(
      [nat64, text, text, text, text, nat64],
      Result(text, text),
      async (_id, _name, _image, _description, _location, _price) => {
          const productOpt = Marketplace.products.get(_id);
          if ("None" in productOpt) {
              return Err("Product not found");
          }
          const product = productOpt.Some;
          if (product.owner != ic.caller()) {
              return Err("You're not allowed to edit this product");
          }
          product.name = _name;
          product.description = _description;
          product.image = _image;
          product.location = _location;
          product.price = _price;
          Marketplace.products.insert(_id, product);
          return Ok("Product edited successfully");
      }
  ),

  deleteProduct: update(
      [nat64],
      Result(text, text),
      async (_id) => {
          const productOpt = Marketplace.products.get(_id);
          if ("None" in productOpt) {
              return Err("Product not found");
          }
          const product = productOpt.Some;
          if (product.owner != ic.caller()) {
              return Err("You're not allowed to delete this product");
          }
          Marketplace.products.remove(_id);
          return Ok("Product deleted successfully");
      }
  ),

  readProduct: query(
      [nat64],
      Result(Product, text),
      async (_index) => {
          const productOpt = Marketplace.products.get(_index);
          if ("None" in productOpt) {
              return Err("Product not found");
          }
          return Ok(productOpt.Some);
      }
  ),

  buyProduct: update(
      [nat64],
      Result(text, text),
      async (_index) => {
          const productOpt = Marketplace.products.get(_index);
          if ("None" in productOpt) {
              return Err("Product not found");
          }
          const product = productOpt.Some;
          if (product.price == 0n) {
              return Err("You can't buy this product");
          }
          const tokenContract = IERC20Token(Marketplace.UsdTokenAddress);
          const allowance = await tokenContract.allowance(ic.caller(), Marketplace.UsdTokenAddress);
          if (allowance < product.price) {
              return Err("Insufficient allowance to buy this product");
          }
          const transferResult = await tokenContract.transferFrom(ic.caller(), product.owner, product.price);
          if (transferResult) {
              product.sold += 1n;
              Marketplace.products.insert(_index, product);
              return Ok("Product bought successfully");
          } else {
              return Err("Transfer failed");
          }
      }
  ),

  getProductsLength: query(
      [],
      nat64,
      async () => {
          return Marketplace.productsLength;
      }
  )
});

export default Marketplace;
