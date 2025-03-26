
import React from "react";
import { Helmet } from "react-helmet";
import MainNavbar from "@/components/MainNavbar";

const History = () => {
  return (
    <>
      <Helmet>
        <title>历史文件 | File Manager</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <MainNavbar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <h1 className="text-3xl font-semibold mb-6">历史文件</h1>
          <p className="text-muted-foreground">
            此页面显示历史文件记录。
          </p>
        </div>
      </div>
    </>
  );
};

export default History;
