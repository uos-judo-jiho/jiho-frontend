import React from "react";
import Title from "@/components/layouts/Title";

type FormContainerProps = {
  children: React.ReactNode;
  title: string;
};

function FormContainer({ children, title }: FormContainerProps) {
  return (
    <div className="w-full h-full">
      <Title title={title} color="black" />
      {children}
    </div>
  );
}

export default FormContainer;
