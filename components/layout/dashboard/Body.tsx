"use client";

import ProductList from "../ProductList";
import Category from "./Category";
import { ProductType } from "@/types/product";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const baseUrl = "https://pintu-sewa.up.railway.app/api/product";

interface ErrorSchema {
  error_code: string;
  error_message: string;
}

interface ResponseSchema {
  error_schema: ErrorSchema;
  output_schema: any[]; 
}

const fetchMostRentedProducts = async (): Promise<ResponseSchema> => {
  try {
    const response = await axios.get(`${baseUrl}/most-rented`);
    return response.data;
  } catch (error) {
    console.error("Error fetching most rented products:", error);
    throw error;
  }
};

const fetchNearCustomerProducts = async (
  customerId: string
): Promise<ResponseSchema> => {
  try {
    const response = await axios.get(
      `${baseUrl}/near-customer?customerId=${customerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching near customer products:", error);
    throw error;
  }
};

const fetchRecommendedProducts = async (): Promise<ResponseSchema> => {
  try {
    const response = await axios.get(`${baseUrl}/recommended`);
    return response.data;
  } catch (error) {
    console.error("Error fetching near customer products:", error);
    throw error;
  }
};

const transformProductData = (data: any): ProductType => {
  return {
    name: data.name || "",
    category: data.category || "",
    rent_category: Number(data.rent_category) || 0,
    rnb: Boolean(data.rnb),
    weight: Number(data.weight) || 0,
    height: Number(data.height) || 0,
    width: Number(data.width) || 0,
    length: Number(data.length) || 0,
    daily_price: Number(data.daily_price) || 0,
    weekly_price: Number(data.weekly_price) || 0,
    monthly_price: Number(data.monthly_price) || 0,
    description: data.description || "",
    condition_description: data.condition_description || "",
    stock: Number(data.stock) || 0,
    status: data.status || "available",
    image: data.image || "/default-product.png",
    address: data.address || "",
    rating: Number(data.rating) || 0,
    rented_times: Number(data.rented_times) || 0
  };
};

const DashboardBody = (userIds:any) => {
  const { data: session } = useSession();

  const [mostRentedProducts, setMostRentedProducts] = useState<ProductType[]>(
    []
  );
  const [nearCustomerProducts, setNearCustomerProducts] = useState<
    ProductType[]
  >([]);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductType[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    console.log("userId di body:", userId);
    console.log("token di body:", token);

    setUserId(localStorage.getItem("userId"));
    setToken(localStorage.getItem("token"));

    const fetchData = async () => {
      setError("");
      try {
        const [mostRented, recommended, nearCustomer] = await Promise.all([
          fetchMostRentedProducts(),
          fetchRecommendedProducts(),
          fetchNearCustomerProducts(userId || ""),
        ]);
        
        setMostRentedProducts(mostRented.output_schema.map(transformProductData));
        setRecommendedProducts(recommended.output_schema.map(transformProductData));
        setNearCustomerProducts(nearCustomer.output_schema.map(transformProductData));

        setLoading(false);

        console.log("mostRentedProducts:", mostRented.output_schema);
        console.log("RecommendedProducts:", recommended.output_schema);
        console.log("nearCustomerProducts:", nearCustomer.output_schema);
      } catch (err) {
        setError("Failed to fetch data" + err);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <div className="flex flex-col px-1 py-2 md:px-6 max-w-[1280px] mx-auto bg-color-layout pb-12 md:pb-[273px]">
      <Category />
      <div>
        <h4 className="font-semibold text-start md:text-center xl:text-start ml-1 text-color-primary text-[20px] md:text-[24px] mt-7 md:mt-0 mb-4">
          Banyak Orang Menyewa Ini
        </h4>
        {error && <div>{error}</div>}
        {mostRentedProducts && (
          <ProductList products={mostRentedProducts} loading={loading} />
        )}
      </div>

      <div className="mt-5 md:mt-20 lg:mt-32">
        {localStorage.getItem("token") || session ? (
          <>
            <h4 className="font-semibold text-start md:text-center xl:text-start ml-1 text-color-primary text-[20px] md:text-[24px] mt-7 md:mt-0 lg:-mt-4 mb-4">
              Dekat Lokasi Kamu
            </h4>
            {error && <div>{error}</div>}
            <ProductList products={nearCustomerProducts} loading={loading} />
          </>
        ) : (
          <>
            <h4 className="font-semibold text-start md:text-center xl:text-start ml-1 text-color-primary text-[20px] md:text-[24px] mt-7 md:mt-0 lg:-mt-4 mb-4">
              Rekomendasi Untuk Kamu
            </h4>
            {error && <div>{error}</div>}
            <ProductList products={recommendedProducts} loading={loading} />
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardBody;
