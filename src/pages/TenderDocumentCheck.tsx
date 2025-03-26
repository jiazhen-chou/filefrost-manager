
import React from "react";
import { Helmet } from "react-helmet";

const TenderDocumentCheck = () => {
  return (
    <>
      <Helmet>
        <title>投标文件检查 | File Manager</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">投标文件检查</h1>
        <p className="text-muted-foreground">
          此页面用于投标文件的检查与验证。
        </p>
      </div>
    </>
  );
};

export default TenderDocumentCheck;
