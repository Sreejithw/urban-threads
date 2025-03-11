const sampleData = {
  users:[
    {
      name: 'SJ',
      email: 'sjWar@example.com',
      password: '1234578',
      role: 'admin'
    },
    {
      name: 'Elliot',
      email: 'elliotR@example.com',
      password: '1234567890',
      role: 'admin'
    },
    {
      name: 'JD',
      email: 'jDorian@example.com',
      password: '12345678',
      role: 'user'
    }
  ],
  products: [
    {
      name: 'Nike Vista Sandal',
      slug: 'nike-vista-sandal',
      category: "Sandsls",
      description: 'Nike sandla for men',
      images: [
        '/images/sample-shoe-images/NIKE+VISTA+SANDAL+BOTTOM.png',
      ],
      price: 59.99,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Nike Cushioned Socks',
      slug: 'nike-cushioned-socks',
      category: "Socks",
      description: 'Comfortable and breathable socks for all-day wear',
      images: [
        '/images/sample-shoe-images/U+NK+ED+PLS+CSH+TOP.png',
      ],
      price: 85.9,
      brand: 'Nike',
      rating: 4.2,
      numReviews: 8,
      stock: 10,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Nike Mercurial Vapor',
      slug: 'nike-mercurial-vapor',
      category: "Running",
      description: 'A perfect blend of sophistication and comfort',
      images: [
        '/images/sample-shoe-images/MERCURIAL+VAPOR+1+RGN+SE+FG+SIDE.png',
      ],
      price: 99.95,
      brand: 'Nike',
      rating: 4.9,
      numReviews: 3,
      stock: 0,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Calvin Klein Slim Fit Stretch Shirt',
      slug: 'calvin-klein-slim-fit-stretch-shirt',
      category: "Men's Dress Shirts",
      description: 'Streamlined design with flexible stretch fabric',
      images: [
        '/images/sample-shoe-images/p4-1.jpg',
      ],
      price: 39.95,
      brand: 'Calvin Klein',
      rating: 3.6,
      numReviews: 5,
      stock: 10,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Nike Vomero 18',
      slug: 'nike-vomero-18',
      category: "Basketball",
      description: 'Nike Vomero 18 for men',
      images: [
        '/images/sample-shoe-images/NIKE+VOMERO+18+SIDE.png',
      ],
      price: 79.99,
      brand: 'Nike',
      rating: 4.7,
      numReviews: 18,
      stock: 6,
      isFeatured: false,
      banner: null,
    },
  ],
};

export default sampleData;
