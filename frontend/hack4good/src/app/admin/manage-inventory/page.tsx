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
    const [showAddModal, setShowAddModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        qty: 0,
        price: 0,
        category: ''
    });

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
    }, [refreshTrigger]);

    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', ...new Set(inventory.map(item => item.category))];
    const filteredInventory = inventory.filter(item => {
        if (selectedCategory !== 'All' && showLowStock) {
            return item.category === selectedCategory && item.qty < 5;
        }
        if (selectedCategory !== 'All' && !showLowStock) {
            return item.category === selectedCategory;
        }
        if (selectedCategory == 'All' && showLowStock) {
            return item.qty < 5;
        }
        return true;
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
                };
                const updateInventoryBody = {
                    product_id : editingItem.id,
                    quantity : Number(editingItem.qty)
                }
                const response = await axiosInstance.put(`/inventory/update`, body);
                if (response.status === 200) {
                    // update all users who are waiting for it to be restocked to be ready !
                    const updateResponse = await axiosInstance.post('/status/update', updateInventoryBody);
                    console.log(updateResponse);
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

    const handleAddItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };
    interface addItemBody {
        name: string
        description: string
        qty: number
        price: number
        category: string
    }
    const handleAddItemClick = async () => {
        try {
            const body : addItemBody = {
                name: newItem.name,
                description: newItem.description,
                qty: newItem.qty,
                price: newItem.price,
                category: newItem.category
            };
            const response = await axiosInstance.post('/inventory/add', body);
            if (response.status === 200) {
                setNewItem({ name: '', description: '', qty: 0, price: 0, category: '' });
                setShowAddModal(false);
                setRefreshTrigger((prev) => !prev); // Toggle refreshTrigger to re-fetch inventory
                toast.success('Item added successfully', {
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error('Error adding item:', error);
            toast.error('Failed to add item', {
                duration: 5000,
            });
        }
    };

    return (
        <div className="p-5 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-5 text-gray-800">Inventory Management</h1>
            
            {/* Add Item Button */}
            <div className="flex justify-between items-center mb-5">
                <div>
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
                        className={!showLowStock ? "ml-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 focus:outline-none" : "ml-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 focus:outline-none"}
                    >
                        {showLowStock ? 'Show All Items' : 'Show Low Stock Items'}
                    </button>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-700"
                >
                    Add Item
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

            {/* Add Item Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-3 text-black">Add New Item</h2>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newItem.name}
                            onChange={handleAddItemChange}
                            className="w-full border rounded p-2 mb-3 text-black"
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={newItem.description}
                            onChange={handleAddItemChange}
                            className="w-full border rounded p-2 mb-3 text-black"
                        />
                        <input
                            type="number"
                            name="qty"
                            placeholder="Quantity"
                            value={newItem.qty === 0 ? '' : newItem.qty}
                            onChange={handleAddItemChange}
                            className="w-full border rounded p-2 mb-3 text-black"
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={newItem.price === 0 ? '' : newItem.price}
                            onChange={handleAddItemChange}
                            className="w-full border rounded p-2 mb-3 text-black"
                        />
                        <select
                            name="category"
                            value={newItem.category}
                            onChange={handleAddItemChange}
                            className="w-full border rounded p-2 mb-3 text-black bg-white"
                        >
                            <option value="" disabled>Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothings">Clothings</option>
                            <option value="Food">Food</option>
                           
                        </select>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="mr-3 bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddItemClick}
                                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-700"
                            >
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {!loading && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => router.push("/admin/landing-page")}
                        className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back To Landing Page
                    </button>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
