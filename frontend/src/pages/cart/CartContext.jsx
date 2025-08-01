// CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { CurrencyContext } from '../../components/all_context/CurrencyContext';
import { toast } from "react-toastify";
import axios from 'axios';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { selectedCurrency, convertCurrency } = useContext(CurrencyContext);

  const [cartProducts, setCartProducts] = useState({
    products: [],
    totalPrice: 0,
  });
  const [loading, setLoading] = useState(true);

  const lengthsOfHair = [
    `12", 12", 12"`, `14", 14", 14"`, `16", 16", 16"`, `18", 18", 18"`, `20", 20", 20"`,
    `22", 22", 22"`, `24", 24", 24"`, `26", 26", 26"`, `28", 28", 28"`
  ];

  const calculateTotalPrice = (products) => {
    let total = 0;
    products?.forEach(product => {
      const convertedPrice = convertCurrency(product.productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
      if (!isNaN(convertedPrice)) {
        total += parseFloat(convertedPrice) * (product.quantity || 1);
      }
    });
    return total.toFixed(2);
  };
const [cartCount, setCartCount] = useState(0);

const initializeCartProducts = async () => {
  const storedItems = JSON.parse(localStorage.getItem('cart_items')) || [];
  const arrayOfIds = storedItems.map(item => item.id);

  if (arrayOfIds.length === 0) {
    setLoading(false);
    setCartCount(0); // ← add this
    return { products: [], totalPrice: 0, cartEmpty: true };
  }

  try {
    const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-product-details`, {
      params: { ids: arrayOfIds }
    });

    if (feedback.data.code === 'success') {
      const validIds = feedback.data.data.map(p => p.id);
      const validStoredItems = storedItems.filter(item => validIds.includes(item.id));
      localStorage.setItem('cart_items', JSON.stringify(validStoredItems));

      const mergedProducts = feedback.data.data.map(productDetail => {
        const lengthPrices = [
          productDetail.productPrice12Inches, productDetail.productPrice14Inches, productDetail.productPrice16Inches,
          productDetail.productPrice18Inches, productDetail.productPrice20Inches, productDetail.productPrice22Inches,
          productDetail.productPrice24Inches, productDetail.productPrice26Inches, productDetail.productPrice28Inches
        ];
        const storedItem = validStoredItems.find(item => item.id === productDetail.id);
        const selectedLengthIndex = lengthsOfHair.indexOf(storedItem?.lengthPicked);
        const productPrice = lengthPrices[selectedLengthIndex] || productDetail.productPrice;

        return {
          ...productDetail,
          productPrice: productPrice,
          quantity: storedItem?.quantity || 1,
          lengthPicked: storedItem?.lengthPicked || '',
        };
      });

      const totalPrice = calculateTotalPrice(mergedProducts);
      const newCartCount = mergedProducts.reduce((total, item) => total + (item.quantity || 1), 0);

      setLoading(false);
      setCartCount(newCartCount); // ← set here directly
      return { products: mergedProducts, totalPrice, cartEmpty: false };
    } else {
      setLoading(false);
      setCartCount(0); // ← clear count if fail
      return { products: [], totalPrice: 0, cartEmpty: true };
    }
  } catch (error) {
    setLoading(false);
    setCartCount(0); // ← also clear count on error
    return { products: [], totalPrice: 0, cartEmpty: true };
  }
};


  useEffect(() => {
    const fetchCartProducts = async () => {
      const result = await initializeCartProducts();
      setCartProducts(result);
    };
    fetchCartProducts();
  }, []);

  useEffect(() => {
    const totalPrice = calculateTotalPrice(cartProducts.products);
    setCartProducts(prev => ({ ...prev, totalPrice }));
  }, [cartProducts.products, selectedCurrency]);

const addToCart = async (product, lengthPicked) => {
  let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];
  const productExists = getItems.some(item => item.id === product.id);

  if (productExists) {
    getItems = getItems.filter(item => item.id !== product.id);
    toast.success("Product successfully removed");
  } else {
    getItems.push({ id: product.id, lengthPicked, quantity: 1 });
    toast.success("Product added successfully");
  }

  localStorage.setItem('cart_items', JSON.stringify(getItems));

  // Instead of calling initializeCartProducts again, extract logic here:
  const storedItems = getItems;
  const arrayOfIds = storedItems.map(item => item.id);

  if (arrayOfIds.length === 0) {
    setCartProducts({ products: [], totalPrice: 0 });
    setCartCount(0);
    return;
  }

  try {
    const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-product-details`, {
      params: { ids: arrayOfIds }
    });

    if (feedback.data.code === 'success') {
      const validIds = feedback.data.data.map(p => p.id);
      const validStoredItems = storedItems.filter(item => validIds.includes(item.id));
      localStorage.setItem('cart_items', JSON.stringify(validStoredItems));

      const mergedProducts = feedback.data.data.map(productDetail => {
        const lengthPrices = [
          productDetail.productPrice12Inches, productDetail.productPrice14Inches, productDetail.productPrice16Inches,
          productDetail.productPrice18Inches, productDetail.productPrice20Inches, productDetail.productPrice22Inches,
          productDetail.productPrice24Inches, productDetail.productPrice26Inches, productDetail.productPrice28Inches
        ];
        const storedItem = validStoredItems.find(item => item.id === productDetail.id);
        const selectedLengthIndex = lengthsOfHair.indexOf(storedItem?.lengthPicked);
        const productPrice = lengthPrices[selectedLengthIndex] || productDetail.productPrice;

        return {
          ...productDetail,
          productPrice,
          quantity: storedItem?.quantity || 1,
          lengthPicked: storedItem?.lengthPicked || '',
        };
      });

      const totalPrice = calculateTotalPrice(mergedProducts);
      const newCount = mergedProducts.reduce((total, item) => total + (item.quantity || 1), 0);

      setCartProducts({ products: mergedProducts, totalPrice });
      setCartCount(newCount);
    } else {
      setCartProducts({ products: [], totalPrice: 0 });
      setCartCount(0);
    }
  } catch (error) {
    setCartProducts({ products: [], totalPrice: 0 });
    setCartCount(0);
  }
};


  const updateCartItemLength = (productId, newLength, lengthPrice) => {
    const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
    const storedItem = storedItems.find(item => item.id === productId);
    if (!storedItem) return;

    storedItem.lengthPicked = newLength;
    localStorage.setItem("cart_items", JSON.stringify(storedItems));

    const updatedItems = cartProducts.products.map(item =>
      item.id === productId ? { ...item, lengthPicked: newLength, productPrice: lengthPrice } : item
    );

    toast.success('Length of product updated in cart');
    setCartProducts(prev => ({ ...prev, products: updatedItems }));
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
    const storedItem = storedItems.find(item => item.id === productId);
    if (!storedItem) return;

    storedItem.quantity = newQuantity;
    localStorage.setItem("cart_items", JSON.stringify(storedItems));

    const updatedItems = cartProducts.products.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartProducts(prev => ({
      ...prev,
      products: updatedItems,
      totalPrice: calculateTotalPrice(updatedItems)
    }));
  };

  const calculateTotalLength = () => {
    return cartProducts.products.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider value={{
      loading,
      cartProducts,
      setCartProducts,
      addToCart,
      calculateTotalPrice,
      calculateTotalLength,
      updateCartItemLength,
      updateCartItemQuantity,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;























// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { CurrencyContext } from '../../components/all_context/CurrencyContext';
// import { toast } from "react-toastify";
// import axios from 'axios';

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const { fetchExchangeRates, selectedCurrency, convertCurrency } = useContext(CurrencyContext);

//   const [cartProducts, setCartProducts] = useState({
//     products: [],
//     totalPrice: 0,
//   });
//   const [loading, setLoading] = useState(true); // Add loading state

//   const lengthsOfHair = [
//     `12", 12", 12"`,
//     `14", 14", 14"`,
//     `16", 16", 16"`,
//     `18", 18", 18"`,
//     `20", 20", 20"`,
//     `22", 22", 22"`,
//     `24", 24", 24"`,
//     `26", 26", 26"`,
//     `28", 28", 28"`,
//   ];

//   const calculateTotalPrice = (products) => {
//     let total = 0;
//     products?.forEach(product => {
//       const convertedPrice = convertCurrency(product.price, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//       if (!isNaN(convertedPrice)) {
//         total += parseFloat(convertedPrice);
//       }
//     });
//     return total.toFixed(2);
//   };

//   const initializeCartProducts = async () => {
//     const storedItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const arrayOfIds = storedItems.map(item => item.id);

//     if (arrayOfIds.length === 0 || !storedItems) {
//       setLoading(false); // Stop loading if no items
//       return {
//         products: [],
//         totalPrice: 0,
//         cartEmpty: true
//       };
//     }

//     try {
//       const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-product-details`, {
//         params: { ids: arrayOfIds }
//       });

//       if (feedback.data.code === 'success') {
//         const validIds = feedback.data.data.map(productDetail => productDetail.id);
//         const validStoredItems = storedItems.filter(item => validIds.includes(item.id));

//         if (validStoredItems.length !== storedItems.length) {
//           localStorage.setItem('cart_items', JSON.stringify(validStoredItems));
//         }

//         const mergedProducts = feedback.data.data.map(productDetail => {
//           console.log(productDetail)
//           const lengthPrices = [productDetail.productPrice12Inches, productDetail.productPrice14Inches, productDetail.productPrice16Inches,
//             productDetail.productPrice18Inches, productDetail.productPrice20Inches, productDetail.productPrice22Inches,
//             productDetail.productPrice24Inches, productDetail.productPrice26Inches, productDetail.productPrice28Inches
//           ]
//           // console.log(lengthPrices)
          
//           const storedItem = storedItems.find(item => item.id === productDetail.id);
//           const selectedLengthIndex = lengthsOfHair.indexOf(storedItem?.lengthPicked);
//           // console.log(selectedLengthIndex)

//           const productPrice = lengthPrices[selectedLengthIndex]
//           let convertedPrice = convertCurrency(productDetail.productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//           convertedPrice = Number(convertedPrice);
//           return {
//             ...productDetail,
//             updatedPrice: convertedPrice.toLocaleString(),
//             quantity: storedItem?.quantity || 1,
//             lengthPicked: storedItem?.lengthPicked || '',
//             productPrice: productPrice
//           };
//         });

//         const totalPrice = calculateTotalPrice(mergedProducts);
//         setLoading(false); // Set loading to false once data is ready
//         return {
//           products: mergedProducts,
//           totalPrice: totalPrice,
//           cartEmpty: false
//         };
//       } else {
//         setLoading(false); // Set loading to false even if there's an error
//         return {
//           products: [],
//           totalPrice: 0,
//           cartEmpty: true
//         };
//       }
//     } catch (error) {
//       setLoading(false);
//       return {
//         products: [],
//         totalPrice: 0,
//         cartEmpty: true
//       };
//     }
//   };

//   useEffect(() => {
//     const fetchCartProducts = async () => {
//       const products = await initializeCartProducts();
//       setCartProducts(products);
//     };
//     fetchCartProducts();
//   }, []);

//   useEffect(() => {
//     const totalPrice = calculateTotalPrice(cartProducts.products);
//     setCartProducts((prev) => ({
//       ...prev,
//       totalPrice
//     }));
//   }, [cartProducts.products, selectedCurrency]);

//   const addToCart = async (product, lengthPicked) => {
//     let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const productExists = getItems.some(item => item.id === product.id);

//     if (productExists) {
//       getItems = getItems.filter(item => item.id !== product.id);
//       const products = await initializeCartProducts();
//       setCartProducts(products);
//       toast.success("Product successfully removed");
//     } else {
//       getItems.push({
//         id: product.id,
//         lengthPicked: lengthPicked,
//         quantity: 1
//       });
//       const products = await initializeCartProducts();
//       setCartProducts(products);
//       toast.success("Product added successfully");
//     }

//     localStorage.setItem('cart_items', JSON.stringify(getItems));
//     const products = await initializeCartProducts();
//     setCartProducts(products);
//   };

//   const updateCartItemLength = (productId, newLength, lengthPrice) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.lengthPicked = newLength;

//     const updatedItems = cartProducts.products.map((item) =>
//       item.id === productId ? { ...item, lengthPicked: newLength, productPrice: lengthPrice} : item
//     );

//     toast.success('Length of product updated in cart');
//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems
//     }));

//     localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//   };

//     const updateCartItemQuantity = (productId, newQuantity) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.quantity = newQuantity;

//     const updatedItems = cartProducts?.products?.map((item) =>
//       item.id === productId ? { ...item, quantity: newQuantity } : item
//     );
//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       totalPrice: calculateTotalPrice(updatedItems, selectedCurrency) // Update totalPrice here
//     }));
//     const filteredItems = updatedItems.map(item => ({
//       id: item.id,
//       quantity: item.quantity,
//       lengthPicked: item.lengthPicked
//     }));
//     localStorage.setItem("cart_items", JSON.stringify(filteredItems));
//   };

//     const calculateTotalLength = () => {
//     return cartProducts?.products?.length || 0;
//   }; 

//   return (
//     <CartContext.Provider value={{ loading, cartProducts, setCartProducts, addToCart, calculateTotalPrice, calculateTotalLength, updateCartItemLength, updateCartItemQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;























// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { CurrencyContext } from '../../components/all_context/CurrencyContext';
// import {toast} from "react-toastify"
// import axios from 'axios';


// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
  
//   const { fetchExchangeRates, selectedCurrency, convertCurrency } = useContext(CurrencyContext);

//   // Function to calculate total price
//   const calculateTotalPrice = (products) => {
//     console.log(products)
//     let total = 0;
  
//     products?.forEach(product => {
//       const convertedPrice = convertCurrency(product.price, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//       console.log(`Item ID: ${product.id}, Original Price: ${product.price}, Converted Price: ${convertedPrice}`);
//       if (isNaN(convertedPrice)) {
//         console.error(`Conversion error for item ID: ${product.id}, Converted Price: ${convertedPrice}`);
//         // Handle error or skip item
//       } else {
//         total += parseFloat(convertedPrice);
//       }
//     });
  
//     // console.log(`Total Price in ${selectedCurrency}: ${total.toFixed(2)}`);
//     return total.toFixed(2);
//   };

//   // Initialize the cartProducts state
//   const initializeCartProducts = async () => {
//     // Retrieve stored cart items (only id, lengthPicked, quantity)
//     const storedItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const arrayOfIds = storedItems.map(item => item.id); // Extract the array of product ids

//     if (arrayOfIds.length === 0 || !storedItems) {
//       return {
//         products: [],
//         recentlyAddedProducts: [],
//         productAddedToCartAnimation: false,
//         addToCartAnimationMessage: '',
//         totalPrice: 0,
//         lengthUpdateMessage: "",
//         cartEmpty: true
//       };
//     }

//     try {
//       // Make an API call to fetch product details using the array of IDs
//       const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-product-details`, {
//         params: {
//           ids: arrayOfIds
//         }
//       });
//       console.log(feedback)

//       if (feedback.data.code === 'success') {
//         // Get the valid IDs from the response
//         const validIds = feedback.data.data.map(productDetail => productDetail.id);

//         // Filter out invalid items from storedItems
//         const validStoredItems = storedItems.filter(item => validIds.includes(item.id));

//         // If there are any invalid items, update localStorage
//         if (validStoredItems.length !== storedItems.length) {
//           localStorage.setItem('cart_items', JSON.stringify(validStoredItems));
//         }


//         // Merge the storedItems (which has lengthPicked and quantity) with feedback.data.data (which has the product details)
//         const mergedProducts = feedback.data.data.map(productDetail => {
//           const storedItem = storedItems.find(item => item.id === productDetail.id);
//           // const convertedPrice = convertCurrency(productDetail.productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//           let convertedPrice = convertCurrency(productDetail.productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//           convertedPrice = Number(convertedPrice);

//             return {
//               ...productDetail,
//               updatedPrice: convertedPrice.toLocaleString(),
//               quantity: storedItem?.quantity || 1, // Add the stored quantity, default to 1 if not found
//               lengthPicked: storedItem?.lengthPicked || '' // Add the stored lengthPicked
//             };
      
         
//         });

//         // Calculate the total price
//         const totalPrice = calculateTotalPrice(mergedProducts, selectedCurrency);
//         console.log('Initializing cart products with total price:', totalPrice);

//         return {
//           products: mergedProducts, // Set the merged products
//           recentlyAddedProducts: [],
//           productAddedToCartAnimation: false,
//           addToCartAnimationMessage: '',
//           totalPrice: totalPrice, // Set initial total price
//           lengthUpdateMessage: "",
//           cartEmpty: false
//         };
//       } else {
//         return {
//           products: [],
//           recentlyAddedProducts: [],
//           productAddedToCartAnimation: false,
//           addToCartAnimationMessage: '',
//           totalPrice: 0,
//           lengthUpdateMessage: "",
//           cartEmpty: false
//         };
//       }
//     } 
//     catch (error) {
//       // console.error('Error fetching product details:', error.message);
//       return {
//         products: [],
//         recentlyAddedProducts: [],
//         productAddedToCartAnimation: false,
//         addToCartAnimationMessage: '',
//         totalPrice: 0,
//         lengthUpdateMessage: "",
//         cartEmpty: false
//       };
//     }
// };

//   // State to store cart products
//   const [cartProducts, setCartProducts] = useState({
//     products: [],
//     totalPrice: 0,
//   });
//   // Fetch and set cart products on mount
//   useEffect(() => {
//     const fetchCartProducts = async () => {
//       const products = await initializeCartProducts();
//       setCartProducts(products);
//     };

//     fetchCartProducts();
//   }, []);


//   useEffect(() => {
//     // Update the total price whenever the cart products or selected currency change
//     const totalPrice = calculateTotalPrice(cartProducts.products, selectedCurrency);
//     console.log('Updating total price to:', totalPrice);
//     setCartProducts((prev) => ({
//       ...prev,
//       totalPrice
//     }));
//   }, [cartProducts.products, selectedCurrency]);

//   const addToCart = async (product, lengthPicked) => {
//     let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const productExists = getItems.some(item => item.id === product.id);

//     if (productExists) {
//       getItems = getItems.filter(item => item.id !== product.id);
//       const products = await initializeCartProducts();
//       setCartProducts(products);
     
//       toast.success("Product successfully removed")
//     } else {
//       getItems.push({
//         // ...product,
//         id: product.id,
//         lengthPicked: lengthPicked,
//         quantity: 1
//       });
//       const products = await initializeCartProducts();
//       setCartProducts(products);
//       toast.success("Product added successfully")

//     }

//     localStorage.setItem('cart_items', JSON.stringify(getItems));
//     const products = await initializeCartProducts();
//     setCartProducts(products);
//     // setCartProducts((prev) => ({
//     //   ...prev,
//     //   products: getItems,
//     //   totalPrice: calculateTotalPrice(getItems, selectedCurrency) // Update totalPrice here
//     // }));
//   };

//   const updateCartItemLength = (productId, newLength, lengthPrice) => {
//     console.log(lengthPrice)
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.lengthPicked = newLength;

//     const updatedItems = cartProducts.products.map((item) =>
//       item.id === productId ? { ...item, lengthPicked: newLength, productPrice: lengthPrice} : item
//     );

//     toast.success('Length of product updated in cart')

//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       lengthUpdateMessage: "Length of product updated in cart",
//     }));

//     setTimeout(() => {
//       setCartProducts((prevProducts) => ({
//         ...prevProducts,
//         lengthUpdateMessage: "",
//       }));
//     }, 3000);

//     localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//   };

//   const updateCartItemQuantity = (productId, newQuantity) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.quantity = newQuantity;

//     const updatedItems = cartProducts?.products?.map((item) =>
//       item.id === productId ? { ...item, quantity: newQuantity } : item
//     );
//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       totalPrice: calculateTotalPrice(updatedItems, selectedCurrency) // Update totalPrice here
//     }));
//     const filteredItems = updatedItems.map(item => ({
//       id: item.id,
//       quantity: item.quantity,
//       lengthPicked: item.lengthPicked
//     }));
//     localStorage.setItem("cart_items", JSON.stringify(filteredItems));
//   };

//   const calculateTotalLength = () => {
//     return cartProducts?.products?.length || 0;
//   }; 

//   return (
//     <CartContext.Provider value={{ cartProducts, setCartProducts, addToCart, calculateTotalPrice, calculateTotalLength, updateCartItemLength, updateCartItemQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;











// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { CurrencyContext } from '../../components/all_context/CurrencyContext';

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const { selectedCurrency, convertCurrency } = useContext(CurrencyContext);

//   const [cartProducts, setCartProducts] = useState({
//     products: JSON.parse(localStorage.getItem('cart_items')) || [],
//     recentlyAddedProducts: [],
//     productAddedToCartAnimation: false,
//     addToCartAnimationMessage: '',
//     totalPrice: "0.00",  // Initialize as a string
//     lengthUpdateMessage: ""
//   });

//   useEffect(() => {
//     // Update the total price whenever the cart products or selected currency change
//     const totalPrice = calculateTotalPrice(cartProducts.products, selectedCurrency);
//     setCartProducts((prev) => ({
//       ...prev,
//       totalPrice
//     }));
//   }, [cartProducts.products, selectedCurrency]);

//   const addToCart = (product, lengthPicked) => {
//     let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const productExists = getItems.some(item => item.id === product.id);

//     if (productExists) {
//       getItems = getItems.filter(item => item.id !== product.id);
//       setCartProducts((prevState) => ({
//         ...prevState,
//         recentlyAddedProducts: prevState.recentlyAddedProducts.filter(id => id !== product.id),
//         productAddedToCartAnimation: true,
//         addToCartAnimationMessage: "Product successfully removed"
//       }));
//     } else {
//       getItems.push({
//         ...product,
//         lengthPicked: lengthPicked,
//         quantity: 1
//       });
//       setCartProducts((prevState) => ({
//         ...prevState,
//         recentlyAddedProducts: [product.id, ...prevState.recentlyAddedProducts],
//         productAddedToCartAnimation: true,
//         addToCartAnimationMessage: <span>Product added successfully <i className="fa-sharp fa-solid fa-circle-check px-2"></i></span>
//       }));
//     }

//     setTimeout(() => {
//       setCartProducts((prevState) => ({
//         ...prevState,
//         productAddedToCartAnimation: false,
//       }));
//     }, 3000);

//     localStorage.setItem('cart_items', JSON.stringify(getItems));
//     setCartProducts((prev) => ({
//       ...prev,
//       products: getItems,
//       totalPrice: calculateTotalPrice(getItems, selectedCurrency) // Update totalPrice here
//     }));
//   };

//   const updateCartItemLength = (productId, newLength) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.lengthPicked = newLength;

//     const updatedItems = cartProducts.products.map((item) =>
//       item.id === productId ? { ...item, lengthPicked: newLength } : item
//     );

//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       lengthUpdateMessage: "Length of product updated in cart",
//     }));

//     setTimeout(() => {
//       setCartProducts((prevProducts) => ({
//         ...prevProducts,
//         lengthUpdateMessage: "",
//       }));
//     }, 3000);

//     localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//   };

//   const updateCartItemQuantity = (productId, newQuantity) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.quantity = newQuantity;

//     const updatedItems = cartProducts.products.map((item) =>
//       item.id === productId ? { ...item, quantity: newQuantity } : item
//     );

//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       totalPrice: calculateTotalPrice(updatedItems, selectedCurrency) // Update totalPrice here
//     }));

//     localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//   };

//   const calculateTotalPrice = (products, currency) => {
//     return products.reduce((acc, item) => {
//       const itemPrice = parseFloat(item.price);
//       if (isNaN(itemPrice)) {
//         console.error(`Invalid price for item ID: ${item.id}, Price: ${item.price}`);
//         return acc;
//       }
//       const convertedPrice = parseFloat(convertCurrency(itemPrice, import.meta.env.VITE_CURRENCY_CODE, currency));
//       if (isNaN(convertedPrice)) {
//         console.error(`Conversion error for item ID: ${item.id}, Original Price: ${item.price}, Converted Price: ${convertedPrice}`);
//         return acc;
//       }
//       console.log(`Item ID: ${item.id}, Original Price: ${item.price}, Converted Price: ${convertedPrice}, Quantity: ${item.quantity}`);
//       return acc + (convertedPrice * item.quantity);
//     }, 0).toFixed(2);
//   };

//   const calculateTotalLength = () => {
//     return cartProducts.products.length || 0;
//   };

//   return (
//     <CartContext.Provider value={{ cartProducts, addToCart, calculateTotalPrice, calculateTotalLength, updateCartItemLength, updateCartItemQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;

















// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { CurrencyContext } from '../../components/all_context/CurrencyContext';

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const { selectedCurrency, convertCurrency } = useContext(CurrencyContext);

//   const [cartProducts, setCartProducts] = useState({
//     products: JSON.parse(localStorage.getItem('cart_items')) || [],
//     recentlyAddedProducts: [],
//     productAddedToCartAnimation: false,
//     addToCartAnimationMessage: '',
//     totalPrice: "0.00",  // Initialize as a string
//     lengthUpdateMessage: ""
//   });

//   useEffect(() => {
//     // Update the total price whenever the cart products or selected currency change
//     const totalPrice = calculateTotalPrice(cartProducts.products, selectedCurrency);
//     setCartProducts((prev) => ({
//       ...prev,
//       totalPrice
//     }));
//   }, [cartProducts.products, selectedCurrency]);

//   const addToCart = (product, lengthPicked) => {
//     let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const productExists = getItems.some(item => item.id === product.id);

//     if (productExists) {
//       getItems = getItems.filter(item => item.id !== product.id);
//       setCartProducts((prevState) => ({
//         ...prevState,
//         recentlyAddedProducts: prevState.recentlyAddedProducts.filter(id => id !== product.id),
//         productAddedToCartAnimation: true,
//         addToCartAnimationMessage: "Product successfully removed"
//       }));
//     } else {
//       getItems.push({
//         ...product,
//         lengthPicked: lengthPicked,
//         quantity: 1
//       });
//       setCartProducts((prevState) => ({
//         ...prevState,
//         recentlyAddedProducts: [product.id, ...prevState.recentlyAddedProducts],
//         productAddedToCartAnimation: true,
//         addToCartAnimationMessage: <span>Product added successfully <i className="fa-sharp fa-solid fa-circle-check px-2"></i></span>
//       }));
//     }

//     setTimeout(() => {
//       setCartProducts((prevState) => ({
//         ...prevState,
//         productAddedToCartAnimation: false,
//       }));
//     }, 3000);

//     localStorage.setItem('cart_items', JSON.stringify(getItems));
//     setCartProducts((prev) => ({
//       ...prev,
//       products: getItems,
//       totalPrice: calculateTotalPrice(getItems, selectedCurrency) // Update totalPrice here
//     }));
//   };

//   const updateCartItemLength = (productId, newLength) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.lengthPicked = newLength;

//     const updatedItems = cartProducts.products.map((item) =>
//       item.id === productId ? { ...item, lengthPicked: newLength } : item
//     );

//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       lengthUpdateMessage: "Length of product updated in cart",
//     }));

//     setTimeout(() => {
//       setCartProducts((prevProducts) => ({
//         ...prevProducts,
//         lengthUpdateMessage: "",
//       }));
//     }, 3000);

//     localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//   };

//   const updateCartItemQuantity = (productId, newQuantity) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.quantity = newQuantity;

//     const updatedItems = cartProducts.products.map((item) =>
//       item.id === productId ? { ...item, quantity: newQuantity } : item
//     );

//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       totalPrice: calculateTotalPrice(updatedItems, selectedCurrency) // Update totalPrice here
//     }));

//     localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//   };

//   const calculateTotalPrice = (products, currency) => {
//     return products.reduce((acc, item) => {
//       const convertedPrice = convertCurrency(item.price, currency);
//       return acc + (parseFloat(convertedPrice) * item.quantity);
//     }, 0).toFixed(2);
//   };

//   const calculateTotalLength = () => {
//     return cartProducts.products.length || 0;
//   };

//   return (
//     <CartContext.Provider value={{ cartProducts, addToCart, calculateTotalPrice, calculateTotalLength, updateCartItemLength, updateCartItemQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;










// import React, { createContext, useState, useEffect } from 'react';

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const [cartProducts, setCartProducts] = useState({
//     products: JSON.parse(localStorage.getItem('cart_items')) || [],
//     recentlyAddedProducts: [],
//     productAddedToCartAnimation: false,
//     addToCartAnimationMessage: '',
//     totalPrice: "0.00",  // Initialize as a string
//     lengthUpdateMessage: ""
//   });

//   useEffect(() => {
//     // Update the total price whenever the cart products change
//     const totalPrice = calculateTotalPrice(cartProducts.products);
//     setCartProducts((prev) => ({
//       ...prev,
//       totalPrice
//     }));
//   }, [cartProducts.products]);

//     const addToCart = (product, lengthPicked) => {
//         let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//         const productExists = getItems.some(item => item.id === product.id);

//         if (productExists) {
//             getItems = getItems.filter(item => item.id !== product.id);
//             setCartProducts((prevState) => ({
//                 ...prevState,
//                 recentlyAddedProducts: prevState.recentlyAddedProducts.filter(id => id !== product.id),
//                 productAddedToCartAnimation: true,
//                 addToCartAnimationMessage: "Product successfully removed"
//             }));
//         } else {
//             getItems.push({
//                 ...product,
//                 lengthPicked: lengthPicked,
//                 quantity: 1
//             });
//             setCartProducts((prevState) => ({
//                 ...prevState,
//                 recentlyAddedProducts: [product.id, ...prevState.recentlyAddedProducts],
//                 productAddedToCartAnimation: true,
//                 addToCartAnimationMessage: <span>Product added successfully <i className="fa-sharp fa-solid fa-circle-check px-2"></i></span>
//             }));
//         }

//         setTimeout(() => {
//         setCartProducts((prevState) => ({
//             ...prevState,
//             productAddedToCartAnimation: false,
//         }));
//         }, 3000);

//         localStorage.setItem('cart_items', JSON.stringify(getItems));
//         setCartProducts((prev) => ({
//         ...prev,
//         products: getItems,
//         totalPrice: calculateTotalPrice(getItems) // Update totalPrice here
//         }));
//     };
//     const updateCartItemLength = (productId, newLength) => {
//         // Retrieve cart items from local storage
//         const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
        
//         // Find the item in local storage
//         const storedItem = storedItems.find(item => item.id === productId);
      
//         if (!storedItem) {
//           // If item doesn't exist in local storage, do nothing
//           return;
//         }
      
//         // Update length in stored item
//         storedItem.lengthPicked = newLength;
      
//         // Update products state with updated items
//         const updatedItems = cartProducts.products.map((item) =>
//           item.id === productId ? { ...item, lengthPicked: newLength } : item
//         );
      
//         setCartProducts((prevProducts) => ({
//           ...prevProducts,
//           products: updatedItems,
//           lengthUpdateMessage: "Length of product updated in cart", // Notification message
//         }));
      
//         // Clear notification message after 3 seconds
//         setTimeout(() => {
//           setCartProducts((prevProducts) => ({
//             ...prevProducts,
//             lengthUpdateMessage: "",
//           }));
//         }, 3000);
      
//         // Save updated items to local storage
//         localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//       };




//       const updateCartItemQuantity = (productId, newQuantity) => {
//         const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
        
//         const storedItem = storedItems.find(item => item.id === productId);
      
//         if (!storedItem) {
//           return;
//         }
        
//         storedItem.quantity = newQuantity;
        
//         const updatedItems = cartProducts.products.map((item) =>
//           item.id === productId ? { ...item, quantity: newQuantity } : item
//         );
      
//         setCartProducts((prevProducts) => ({
//           ...prevProducts,
//           products: updatedItems,
//           totalPrice: calculateTotalPrice(updatedItems) // Update totalPrice here
//         }));
      
//         localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//       };
      

//   const calculateTotalPrice = (products) => {
//     return products.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
//   };
//     const calculateTotalLength = (products) => {
//     return cartProducts.products.length || 0;
// };

//   return (
//     <CartContext.Provider value={{ cartProducts, addToCart, calculateTotalPrice, calculateTotalLength, updateCartItemLength, updateCartItemQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;
































// import React, { createContext, useState, useEffect } from 'react';

// // Create context
// export const CartContext = createContext();

// // CartProvider component to provide cart state and functions
// export const CartProvider = ({ children }) => {
//     const [cartProducts, setCartProducts] = useState({
//         products: [],
//         products_loading: false,
//         recentlyAddedProducts: [], // Maintain a list of recently added product IDs
//         productAddedToCartAnimation: false,
//         addToCartAnimationMessage: ""
//     });

//     // add to cart function
//     const addToCart = (product) => {
//         let getItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//         const productExists = getItems.some(item => item.id === product.id);
      
//         if (productExists) {
//           // Remove product from cart
//           getItems = getItems.filter(item => item.id !== product.id);
//           setCartProducts((prevState) => ({
//             ...prevState,
//             recentlyAddedProducts: prevState.recentlyAddedProducts.filter(id => id !== product.id),
//             productAddedToCartAnimation: true,
//             addToCartAnimationMessage: "Product successfully removed"
//           }));
//         } else {
//           // Add product to cart
//           getItems.push(product);
//           setCartProducts((prevState) => ({
//             ...prevState,
//             recentlyAddedProducts: [product.id, ...prevState.recentlyAddedProducts],
//             productAddedToCartAnimation: true,
//             addToCartAnimationMessage: <span>Product added successfully <i class="fa-sharp fa-solid fa-circle-check px-2"></i></span>
//           }));
//         }
      
//         setTimeout(() => {
//           setCartProducts((prevState) => ({
//             ...prevState,
//             productAddedToCartAnimation: false,
//           }));
//         }, 3000);
      
//         // Save updated cart to localStorage
//         localStorage.setItem("cart_items", JSON.stringify(getItems));
//         setCartProducts((prev) => ({
//           ...prev,
//           products: getItems
//         })); // Update state to trigger re-render
//       };

//     const calculateTotalPrice = (products) => {
//         return cartProducts.products.reduce((acc, item) => acc + parseFloat(item.price), 0);
//     };
//     const calculateTotalLength = (products) => {
//         return cartProducts.products.length || 0;
//     };

//     useEffect(() => {
//         //get cart items
//         const storedItems = JSON.parse(localStorage.getItem('cart_items'));
//         if (storedItems) {
//             setCartProducts((prevState) => ({
//                 ...prevState,
//                 products: storedItems
//             }));
//         } else {
//             // there is nothing in the cart
//         }
//     }, []);

//     return (
//         <CartContext.Provider value={{ cartProducts, addToCart, calculateTotalPrice, calculateTotalLength }}>
//             {children}
//         </CartContext.Provider>
//     );
// };
