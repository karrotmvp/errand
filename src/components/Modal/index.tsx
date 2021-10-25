import styled from "@emotion/styled";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

type ChildrenPosition = "top" | "middle" | "bottom";
type ModalProps = {
  onClose: any;
  maskClosable: boolean;
  childrenPosition?: ChildrenPosition;
  children: React.ReactNode;
};

export default function Modal({
  onClose,
  maskClosable,
  children,
  childrenPosition = "middle",
}: ModalProps) {
  const onMaskClick = (e: React.MouseEvent<HTMLElement>) => {
    if (maskClosable && onClose) {
      onClose(e);
    }
  };

  useEffect(() => {
    document.body.style.cssText = `position: fixed; top: -${window.scrollY}px`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = `position: ""; top: "";`;
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
  }, []);
  return (
    <Portal>
      <ModalOverlay />
      <ModalWrapper onClick={onMaskClick} childrenPosition={childrenPosition}>
        <div className="modal__inner">{children}</div>
      </ModalWrapper>
    </Portal>
  );
}

const ModalOverlay = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;
const ModalWrapper = styled.div<{ childrenPosition: ChildrenPosition }>`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;

  display: flex;
  flex-direction: column;
  justify-content: ${({ childrenPosition }) => {
    switch (childrenPosition) {
      case "top":
        return "start";
      case "middle":
        return "center";
      case "bottom":
        return "flex-end";
    }
  }};

  /* .modal__inner {
    box-sizing: border-box;
    position: relative;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
    background-color: #fff;
    border-radius: 10px;
    width: 360px;
    max-width: 480px;
    transform: translateY(-50%);
    margin: 0 auto;
    padding: 40px 20px;
  } */
`;

type PortalProps = {
  children: React.ReactNode;
};

const Portal = ({ children }: PortalProps) => {
  const rootElement = useMemo(() => document.getElementById("modal-root"), []);

  if (!rootElement) {
    throw new Error("없음");
  }

  return createPortal(children, rootElement);
};
