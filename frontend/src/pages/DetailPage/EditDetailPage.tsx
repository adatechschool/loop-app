import React from "react";
import FormEditPlace from "../../components/FormEditPlace";
import { CloseButton } from "@chakra-ui/react";

const EditDetailPage: React.FC = () => {
  return (
    <>
      <CloseButton
        position="absolute"
        top={4}
        left={4}
        onClick={() => window.history.back()}
        size={"lg"}
      />
      <FormEditPlace />
    </>
  );
};

export default EditDetailPage;
