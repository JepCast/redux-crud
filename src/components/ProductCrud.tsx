import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaBoxOpen } from "react-icons/fa";

import {
    useAddNewProductMutation,
    useDeleteProductMutation,
    useGetAllProductsQuery,
    useUpdateProductMutation,
    type Product,
} from "../app/service/dummyData";

const ProductCrud: React.FC = () => {
    const { data, isLoading, error } = useGetAllProductsQuery();

    const [deleteProduct] = useDeleteProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [addNewProduct] = useAddNewProductMutation();

    const [newProduct, setNewProduct] = useState<Pick<Product, "title" | "description" | "brand">>({

        title: "",
        description: "",
        brand: "",
    });

    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const handleAddProduct = async () => {
        if (!newProduct.title) return alert("El título es obligatorio");
        try {
            await addNewProduct(newProduct).unwrap(); // cache se inserta en onQueryStarted
            setNewProduct({ title: "", description: "", brand: "" });
        } catch (err) {
            console.error("Error al agregar producto:", err);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            await deleteProduct({ id }).unwrap(); // cache se quita en onQueryStarted
        } catch (err) {
            console.error("Error al eliminar producto:", err);
        }
    };

    const handleUpdateProduct = async () => {
        if (!editProduct) return;
        try {
            await updateProduct({
                id: editProduct.id,
                newProduct: {
                    title: editProduct.title,
                    description: editProduct.description,
                    brand: editProduct.brand,
                },
            }).unwrap(); // cache se actualiza en onQueryStarted
            setEditProduct(null);
        } catch (err) {
            console.error("Error al actualizar producto:", err);
        }
    };

    if (isLoading) return <p className="text-black font-bold">Cargando productos...</p>;
    if (error) return <p className="text-red-500 font-bold">Error al cargar productos</p>;

    return (
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-800 justify-center flex items-center gap-3">
                <FaBoxOpen className="text-indigo-500" /> CRUD of products
            </h1>

            {/* Formulario para agregar */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-inner">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                    <FaPlus className="text-green-500" /> Agregar producto
                </h2>
                <div className="flex flex-col gap-3">
                    <input
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        placeholder="Title"
                        value={newProduct.title}
                        onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    />
                    <textarea
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        placeholder="Description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                    <input
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        placeholder="Brand"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    />
                    <button
                        onClick={handleAddProduct}
                        disabled={isLoading}
                        className="cursor-pointer flex items-center justify-center gap-2 px-5 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                    >
                        <FaPlus /> Add
                    </button>
                </div>
            </div>

            {/* Lista de productos */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                    <FaBoxOpen className="text-indigo-500" /> Product List
                </h2>
                <ul className="space-y-4">
                    {data?.products.map((product) => (
                        <li
                            key={product.id}
                            className="border p-5 rounded-xl shadow-md flex justify-between items-start hover:shadow-lg transition bg-white"
                        >
                            {editProduct?.id === product.id ? (
                                <div className="flex-1 space-y-3 mr-4">
                                    <input
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                        value={editProduct.title}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, title: e.target.value })
                                        }
                                    />
                                    <textarea
                                        rows={5}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                        value={editProduct.description}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, description: e.target.value })
                                        }
                                    />
                                    <input
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                        value={editProduct.brand}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, brand: e.target.value })
                                        }
                                    />
                                    <button
                                        onClick={handleUpdateProduct}
                                        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    >
                                        <FaSave /> Save
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{product.id} - {product.title}</h3>
                                    <p className="text-gray-600">{product.description}</p>
                                    <span className="text-sm text-gray-500 font-serif ">Brand: {product.brand}</span>
                                </div>
                            )}
                            <div className="flex gap-3 mt-2 ml-6 flex-col">
                                <button
                                    onClick={() =>
                                        setEditProduct({
                                            id: product.id,
                                            title: product.title,
                                            description: product.description,
                                            brand: product.brand,
                                        })
                                    }
                                    className="cursor-pointer flex items-center gap-1 px-3 py-2 bg-orange-400 text-white rounded-lg hover:bg-yellow-500 transition"
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="cursor-pointer flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

};

export default ProductCrud;
