import products from "./products.json";
import fs from "fs";

export const handler = (req, res) => {
  if (req.method === "POST") {
    try {
      console.log("body is ", req.body);
      const { name, price, image_url, description, filename, hash } = req.body;

      //create new product id based on last product ID
      const maxID = products.reduce(
        (max, product) => Math.max(max, product.id),
        0
      );
      products.push({
        id: maxID + 1,
        name,
        price,
        image_url,
        description,
        filename,
        hash,
      });
      fs.writeFileSync(
        "./pages/api/products.json",
        JSON.stringify(products, null, 2)
      );
      res.status(200).send({ status: "ok" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "error adding product" });
      return;
    }
  } else {
    res.status(405).send(`Method ${req.method} not allowed`);
  }
};
