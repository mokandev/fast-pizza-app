import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";

function Menu() {

  // Getting access to the data of the route that is connected with the loader funct.
  const menu = useLoaderData()
  return <ul>{menu.map((pizza) => <MenuItem pizza={pizza} key={pizza.id} />)}</ul>;
}

export const loader = async () => {
  const menu = await getMenu() 
  return menu;
}

export default Menu;
