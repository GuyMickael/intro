import { Box } from "@mui/material";

const Header = () => {
  return (
    <Box
      bgcolor={"red"}
      width={"100%"}
      position="fixed"
      height="65px"
      top={0}
      zIndex={999}
    >
      <img src="/pokedexImage.png" width="150px" />
    </Box>
  );
};

export default Header;
