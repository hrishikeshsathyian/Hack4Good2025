"use client";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axiosInstance from "@/utils/axiosInstance";
import { InventoryItem } from '@/utils/interfaces';
import toast from 'react-hot-toast';

const InventoryPage = () => {
    const router = useRouter();  
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [showLowStock, setShowLowStock] = useState(false);

    useEffect(() => {
        async function fetchInventory() {
          try {
            const response = await axiosInstance.get('/inventory');
            const data = await response.data;
            if (Array.isArray(data)) {
              setInventory(data);
            } else {
              console.error('Invalid inventory data format:', data);
              setInventory([]);
            }
          } catch (error) {
            console.error('Error fetching inventory:', error);
            setInventory([]);
          } finally {
            setLoading(false);
          }
        }
        fetchInventory();
    }, []);

    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', ...new Set(inventory.map(item => item.category))];
    const filteredInventory = inventory.filter(item => {
        // if (showLowStock) {
        //     return item.qty < 5; // Filter items with quantity < 5
        // }
        if (selectedCategory !== 'All' && showLowStock) {
            return item.category === selectedCategory && item.qty < 5; // Filter by selected category
        }
        if (selectedCategory !== 'All' && !showLowStock) {
            return item.category === selectedCategory; // Filter by selected category
        }
        if (selectedCategory == 'All' && showLowStock) {
            return item.qty < 5; // Filter by selected category
        }
        return true; // Show all items if no filters are applied
    });

    const handleEditClick = (item: InventoryItem) => {
        setEditingItem({ ...item });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingItem) {
            setEditingItem({ ...editingItem, [e.target.name]: e.target.value });
        }
    };

    const handleSaveClick = async () => {
        if (editingItem) {
            try {
                const body = {
                    product_id: editingItem.id,
                    name: editingItem.name,
                    description: editingItem.description,
                    qty: Number(editingItem.qty),
                    price: Number(editingItem.price),
                }
                console.log(body);
                const response = await axiosInstance.put(`/inventory/update`, body);
                if (response.status === 200) {
                    setInventory(inventory.map(item => item.id === editingItem.id ? editingItem : item));
                    setEditingItem(null);
                    toast.success('Item updated successfully', {
                        duration: 5000,
                    });
                }
            } catch (error) {
                console.error('Error saving item:', error);
            }
        }
    };

    return (
        <div className="p-5 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-5 text-gray-800">Inventory Management</h1>
            
            {/* Category Filter */}
            <div className="mb-5">
                <label htmlFor="category-filter" className="mr-3 font-medium text-gray-700">Filter by Category:</label>
                <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-700"
                >
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => setShowLowStock(!showLowStock)}
                    className={!showLowStock ? "ml-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 focus:outline-none" : "ml-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 focus:outline-none" }
                >
                    {showLowStock ? 'Show All Items' : 'Show Low Stock Items'}
                </button>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 border-b text-gray-700">Name</th>
                            <th className="py-2 px-4 border-b text-gray-700">Description</th>
                            <th className="py-2 px-4 border-b text-gray-700">Quantity</th>
                            <th className="py-2 px-4 border-b text-gray-700">Price ($)</th>
                            <th className="py-2 px-4 border-b text-gray-700">Category</th>
                            <th className="py-2 px-4 border-b text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.map(item => (
                            <tr key={item.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b text-gray-600">
                                    {editingItem?.id === item.id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editingItem.name}
                                            onChange={handleInputChange}
                                            className="border rounded p-1"
                                        />
                                    ) : (
                                        item.name
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b text-gray-600">
                                    {editingItem?.id === item.id ? (
                                        <input
                                            type="text"
                                            name="description"
                                            value={editingItem.description}
                                            onChange={handleInputChange}
                                            className="border rounded p-1"
                                        />
                                    ) : (
                                        item.description
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b text-gray-600">
                                    {editingItem?.id === item.id ? (
                                        <input
                                            type="number"
                                            name="qty"
                                            value={editingItem.qty}
                                            onChange={handleInputChange}
                                            className="border rounded p-1"
                                        />
                                    ) : (
                                        item.qty
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b text-gray-600">
                                    {editingItem?.id === item.id ? (
                                        <input
                                            type="number"
                                            name="price"
                                            value={editingItem.price}
                                            onChange={handleInputChange}
                                            className="border rounded p-1"
                                        />
                                    ) : (
                                        item.price
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b text-gray-600">{item.category}</td>
                                <td className="py-2 px-4 border-b text-gray-600">
                                    {editingItem?.id === item.id ? (
                                        <button
                                            onClick={handleSaveClick}
                                            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-700"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleEditClick(item)}
                                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredInventory.length === 0 && (
                <p className="text-center text-gray-500 mt-5">No items found for the selected category.</p>
            )}
            {!loading &&
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => router.push("/admin/landing-page")}
                    className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back To Landing Page
                </button>
            </div>
}
        </div>
    );
};

export default InventoryPage;
