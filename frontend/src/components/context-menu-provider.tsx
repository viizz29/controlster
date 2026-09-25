import { Menu, MenuItem } from "@mui/material";
import type React from "react";
import { createContext, useContext, useState } from "react";

interface MenuParams {
  x: number;
  y: number;
}

interface AContextMenuItem { caption: string, handler: () => void }

type ContextMenuContextType = {
  openContextMenu: (e: React.MouseEvent) => void;
  closeMenu: () => void;
  setMenuItems: (items: AContextMenuItem[]) => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

export const ContextMenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  // Context menu state
  const [menuParams, setMenuParams] = useState<MenuParams | null>(null);


  const [menuItems, setMenuItems] = useState<AContextMenuItem[]>([]);


  const openContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuParams({ x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => setMenuParams(null);

  return <ContextMenuContext.Provider value={{ openContextMenu, closeMenu, setMenuItems }}>
    <div>{children}</div>

    {/* Context Menu */}
    <Menu
      open={menuParams !== null}
      onClose={closeMenu}
      anchorReference="anchorPosition"
      anchorPosition={
        menuParams !== null
          ? { top: menuParams.y, left: menuParams.x }
          : undefined
      }
    >
      {/* <MenuItem onClick={dummyHandler}>Edit</MenuItem>
      <MenuItem onClick={dummyHandler}>Bookmark</MenuItem>
      <MenuItem onClick={dummyHandler}>Delete</MenuItem> */}

      {menuItems.map((item, index) => (
        <MenuItem key={`menu-item-${index}`} onClick={item.handler}>{item.caption}</MenuItem>
      ))}
    </Menu>
  </ContextMenuContext.Provider >;
};

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within ContextMenuProvider");
  }
  return context;
}