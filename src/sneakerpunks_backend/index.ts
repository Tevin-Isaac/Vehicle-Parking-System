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

// Interface for the ERC20 token, in our case, USD
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

  // Product Record Definition
  Product: Record({
    owner: Principal,
    name: text,
    image: text,
    description: text,
    location: text,
    price: nat64,
    sold: nat64,
    createdAt: nat64
  }),

  // Map to store products
  products: StableBTreeMap(0, nat64, Product),

  // Function to create a new product
  writeProduct: update(
    [text, text, text, text, nat64],
    Result(nat64, text),
    async (_name, _image, _description, _location, _price) => {
      const sold = 0n;
      const owner = ic.caller();
      const createdAt = Date.now();
      const productId = Marketplace.productsLength;
      const product = {
        owner,
        name: _name,
        image: _image,
        description: _description,
        location: _location,
        price: _price,
        sold,
        createdAt
      };
      Marketplace.products.insert(productId, product);
      Marketplace.productsLength += 1n;
      return Ok(productId);
    }
  ),

  // Function to edit an existing product
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

  // Function to delete a product
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

  // Function to read a product by its index
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

  // Function to buy a product
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

  // Function to get the total number of products
  getProductsLength: query(
    [],
    nat64,
    async () => {
      return Marketplace.productsLength;
    }
  ),

  // Added Functionalities

  // Function to get a list of products
  getProducts: query(
    [],
    Result(Vec(Product), text),
    async () => {
      const products = Marketplace.products.entries();
      return Ok(products);
    }
  ),

  // Function to search for products by name or location
  searchProducts: query(
    [text],
    Result(Vec(Product), text),
    async (searchQuery) => {
      const products = Marketplace.products.entries();
      const filteredProducts = products.filter(
        ([_id, product]) =>
          product.name.includes(searchQuery) ||
          product.location.includes(searchQuery)
      );
      return Ok(filteredProducts);
    }
  ),

  // Function to get the top-selling products
  getTopSellers: query(
    [nat64], // Limit parameter
    Result(Vec(Product), text),
    async (limit) => {
      const products = Marketplace.products.entries();
      const sortedProducts = products.sort(
        ([_id1, product1], [_id2, product2]) =>
          product2.sold - product1.sold
      );
      const topSellers = sortedProducts.slice(0, limit);
      return Ok(topSellers);
    }
  )
});

export default Marketplace;