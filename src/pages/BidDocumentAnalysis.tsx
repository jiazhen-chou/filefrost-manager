
import React from "react";
import { Helmet } from "react-helmet";

const BidDocumentAnalysis = () => {
  return (
    <>
      <Helmet>
        <title>招标文件解析 | File Manager</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">招标文件解析</h1>
        <p className="text-muted-foreground">
          此页面用于招标文件的解析与处理。
        </p>
      </div>
    </>
  );
};

export default BidDocumentAnalysis;
