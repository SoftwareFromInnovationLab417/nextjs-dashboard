import { AppProps } from "next/app";
import React, { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";

interface OffcanvasProps {
  placement: 'start' | 'end' | 'top' | 'bottom';
  show: boolean;
  onHide: (arg0: boolean) => void;
  name: string;
  children: React.ReactNode;
}

export default function OffCanvas({ show, name, onHide, children, placement }: OffcanvasProps) {
  return (
    <>
      <Offcanvas show={show} onHide={onHide} placement={placement} scroll={false} >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {children}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}