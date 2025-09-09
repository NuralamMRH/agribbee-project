import React from "react";
import { CustomHeader } from "../../api/Headers";
import HeroSectionWithSearch from "../../components/home/hero-section-with-search";
import { useRouter } from "next/router";
import ProductSearchPage from "../../components/products-page/ProductSearchPage";
import CustomContainer from "../../components/container";
import ScrollToTop from "../../components/scroll-top/ScrollToTop";
import HomeGuard from "../../components/home-guard/HomeGuard";

const SearchPage = ({ configData }) => {
  const router = useRouter();
  const { query } = router.query;
  return (
    <>
      <HomeGuard>
        <ScrollToTop />
        {/* <HeroSectionWithSearch query={query} /> */}

        <ProductSearchPage query={query} configData={configData} />
      </HomeGuard>
    </>
  );
};

export default SearchPage;
export const getServerSideProps = async (context) => {
  try {
    const { req } = context;
    const language = req.cookies.languageSetting;
    console.log("language search: ", language);
    // Fetch config data
    const configRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/config`,
      {
        method: "GET",
        headers: {
          "X-software-id": 33571750,
          "X-server": "server",
          "X-localization": language,
          origin: process.env.NEXT_CLIENT_HOST_URL,
        },
      }
    );

    if (!configRes.ok) {
      throw new Error(`Failed to fetch config data: ${configRes.statusText}`);
    }

    const config = await configRes.json();

    // console.log("/api/v1/config: ", config);

    return {
      props: {
        configData: config,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return {
      props: {
        configData: null,
        error: error.message, // Pass the error message to handle it in the component
      },
    };
  }
};
