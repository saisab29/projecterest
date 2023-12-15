import React from "react";
import { BubblyLink } from "react-bubbly-transitions";



const MyBubblyLink = ({ to, children }) => (
  <BubblyLink colorStart="#af44fd" colorEnd="#222222" to={to}>
    {children}
  </BubblyLink>
);

export default MyBubblyLink;
