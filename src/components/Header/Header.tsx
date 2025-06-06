import { Box } from "@mui/material";
import { Link } from "react-router-dom";

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
      <Link to="/flow">
        {" "}
        <img
          src="/pokedexImage.png"
          width="150px"
          data-testid="pokeball-test-img"
        />
      </Link>
    </Box>
  );
};

export default Header;
