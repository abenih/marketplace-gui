// Define the shape of the embedded Product object
export type ProductType = {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  // Mongoose automatically adds _id
  _id: string; 
};

// Define the shape of the embedded Owner object (only contains username, per our service logic)
export type OwnerType = {
  username: string;
};

// Define the shape of the main Ad object
export type AdType = {
  _id: string;
  product: ProductType;
  owner: OwnerType;
  status: string;
  createdDate: string;
};