import styled from "styled-components";
import PropTypes from "prop-types";
import SearchBox from "../home/hero-section-with-search/SearchBox";
import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import { CustomNavSearchIcon } from "../navbar/Navbar.style";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useRouter } from "next/router";
import { useState } from "react";
import useClickOutside from "@/utils/use-click-outside";
import Agribbe from "../LogoText/Agribbe";

const SnUGi = styled.h1`
  margin: 0;
  align-self: stretch;
  position: relative;
  font-size: inherit;
  line-height: 111%;
  font-weight: 700;
  font-family: inherit;
  @media screen and (max-width: 1400px) {
    font-size: 35px;
  }
  @media screen and (max-width: 1200px) {
    font-size: 30px;
  }
  @media screen and (max-width: 960px) {
    font-size: 25px;
  }
  @media screen and (max-width: 420px) {
    font-size: 22px;
  }
`;
const ConnectsLocalFamers = styled.div`
  align-self: stretch;
  position: relative;
  font-size: 28px;
  letter-spacing: 0.08em;
  line-height: 27px;
  font-family: Inter;
  @media screen and (max-width: 1200px) {
    font-size: 20px;
  }
  @media screen and (max-width: 960px) {
    font-size: 15px;
  }
  @media screen and (max-width: 420px) {
    font-size: 14px;
  }
`;
const Herotextblock = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 7px;
`;

const Heromiddlecontent = styled.div`
  align-self: stretch;
  height: 178px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 32px;
  @media screen and (max-width: 990px) {
    padding-right: 100px;
  }
  @media screen and (max-width: 790px) {
    padding-right: 70px;
  }
  @media screen and (max-width: 790px) {
    padding-right: 0px;
  }
`;
const Heromiddleblock = styled.div`
  align-self: stretch;
  flex: 1;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.44);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 38px;
  @media screen and (max-width: 1200px) {
    padding: 25px;
    box-sizing: border-box;
  }
  @media screen and (max-width: 850px) and (min-width: 420px) {
    padding: 10px;
    box-sizing: border-box;
  }
  @media screen and (max-width: 420px) {
    padding: 10px;
    box-sizing: border-box;
  }
`;

const HomePageHero = ({
  banner_section_bg,
  banner_section_title,
  banner_tagline,
  banner_search_placeholder,
  className = "",
}) => {
  const [openSearchBox, setOpenSearchBox] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
  const { query } = router.query;

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const handleSearchBoxOpen = (e) => {
    e.stopPropagation();
    setOpenSearchBox(true);
  };
  const searchBoxRef = useClickOutside(() => {
    setOpenSearchBox(false);
  });

  const handleShowSearch = () => {
    if (openSearchBox) {
      return (
        <Box
          sx={{
            minWidth: "100%",
            marginInlineEnd: "20px",
            padding: isSmall ? "0 10px 0 0" : "0 200px 0 0",
          }}
        >
          <SearchBox placeholder={banner_search_placeholder} query={query} />
        </Box>
      );
    } else if (
      router.pathname !== "/home" &&
      location &&
      router.pathname !== "/"
    ) {
      return (
        <Stack
          onClick={(e) => handleSearchBoxOpen(e)}
          sx={{ transition: "all ease .4s" }}
        >
          <CustomNavSearchIcon>
            <SearchOutlinedIcon sx={{ fontSize: "14px" }} color="primary" />
          </CustomNavSearchIcon>
        </Stack>
      );
    }
  };

  const HomepageheroRoot = styled.section`
    align-self: stretch;
    height: 455px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 68px 350px 68px 202px;
    box-sizing: border-box;
    background-image: url(${banner_section_bg});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top;
    text-align: left;
    font-size: 52px;
    color: #fff;
    font-family: Helvetica;
    @media screen and (max-width: 1200px) {
      padding-left: 100px;
      padding-right: 200px;
      box-sizing: border-box;
    }
    @media screen and (max-width: 960px) {
      padding-left: 150px;
      padding-top: 68px;
      padding-right: 250px;
      box-sizing: border-box;
    }
    @media screen and (max-width: 850px) and (min-width: 420px) {
      padding: 50px 80px 40px 50px;
      box-sizing: border-box;
    }
    @media screen and (max-width: 420px) {
      padding: 20px 10px;
      box-sizing: border-box;
    }
  `;

  return (
    <HomepageheroRoot className={className}>
      <Heromiddleblock>
        <Heromiddlecontent>
          <Herotextblock>
            <SnUGi>
              <Agribbe text={banner_section_title} color={"#7BC043"} />
            </SnUGi>
            <ConnectsLocalFamers>{banner_tagline}</ConnectsLocalFamers>
          </Herotextblock>
          {handleShowSearch()}
        </Heromiddlecontent>
      </Heromiddleblock>
    </HomepageheroRoot>
  );
};

HomePageHero.propTypes = {
  className: PropTypes.string,
};

export default HomePageHero;
