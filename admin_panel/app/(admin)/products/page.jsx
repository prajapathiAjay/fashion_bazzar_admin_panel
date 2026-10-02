// import Link from "next/link";
// import Table from "@/app/components/admin/Table";
// const tableData=[ {productName:"new product",category:"raymond"}]



// export default function Products(){
// const columns = [
//   {
//     col_label: "Product Name",
//     value: "productName",
//   },
//   {
//     col_label: "Product ID",
//     value: "productId",
//   },
//   {
//     col_label: "Category",
//     value: "category",
//   },
//   {
//     col_label: "Price",
//     value: "price",
//   },
//   {
//     col_label: "Quantity",
//     value: "quantity",
//   },
//   {
//     col_label: "Stock",
//     value: "stock",
//   },
//   {
//     col_label: "Status",
//     value: "status",
//   },
//   {
//     col_label: "Created Date",
//     value: "createdDate",
//   },
//   {
//     col_label: "Updated Date",
//     value: "updatedDate",
//   },
//   {
//     col_label: "Actions",
//     value: "actions",
//   },
// ];

//     return (
//     <>
//     {/* <div>Products page
    

//     </div>
//      <Link href="/products/new">Add New Product</Link> */}
     
//   <Table columns={columns} data={tableData} tableHeading={"Products"} addButton={{name:"Add Product",path:"/products/new"}}/>

    
//      </>)
// }


import Table from "@/components/admin/Table";

const tableData = [{ productName: "new product", category: "raymond" }];

export default function Products() {
  const columns = [
    { col_label: "Product Name", value: "productName" },
    { col_label: "Product ID", value: "productId" },
    { col_label: "Category", value: "category" },
    { col_label: "Price", value: "price" },
    { col_label: "Quantity", value: "quantity" },
    { col_label: "Stock", value: "stock" },
    { col_label: "Status", value: "status" },
    { col_label: "Created Date", value: "createdDate" },
    { col_label: "Updated Date", value: "updatedDate" },
    { col_label: "Actions", value: "actions" },
  ];

  return (
    <Table
      columns={columns}
      data={tableData}
      tableHeading={"Products"}
      addButton={{ name: "Add Product", path: "/products/new" }}
    />
  );
}
