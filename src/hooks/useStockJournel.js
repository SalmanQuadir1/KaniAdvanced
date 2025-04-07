import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ADD_STOCKJOURNEL_URL ,GET_STOCK_URL,UPDATE_STOCK_URL,DELETE_STOCK_URL, VIEW_VOUCHERNOS} from '../Constants/utils';
import { fetchunit } from '../redux/Slice/UnitSlice';
import { fetchcolorGroup } from '../redux/Slice/ColorGroupSlice';

import { fetchmaterial } from '../redux/Slice/MaterialSlice';
import { fetchlocation } from '../redux/Slice/LocationSlice';
import { useNavigate } from 'react-router-dom';





const useStockJournel = () => {

  const [stockJournal, setStockJournal] = useState([]);
  const [VoucherNo, setVoucherNo] = useState([])
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 10
  });












    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [stockJournel, setstockJournel] = useState([]);
    const [edit, setEdit] = useState(false);
    
    const dispatch = useDispatch();
    
        const [currentstockJournel, setCurrentStockJournel] = useState({
            productId:"",
           location:"",
           quantity:"",
           transferQuantity:"",
           destinationLocation:""
          });

    useEffect(() => {
        dispatch(fetchunit(token))
        dispatch(fetchmaterial(token))
        dispatch(fetchcolorGroup(token))
        dispatch(fetchlocation(token))
    }, []);

    const typeValues = [
        { value: 'RAW', label: 'RAW' },
        { value: 'SEMIFINISHED', label: 'SEMI FINISHED' },
        { value: 'FINISHED', label: 'FINISHED' }
    ];



    const handleSubmit = async (formattedValues) => {
        console.log(formattedValues,"kikikikiki");
     
        try {
          const url = ADD_STOCKJOURNEL_URL;
          const method = 'POST';
    
          const response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
                formattedValues
  
            ),
          });
    
          const data = await response.json();
          console.log(data,"resssssssss");
          if (response.ok) {
            toast.success(`stockJournel added successfully`);
          
          } else {
            toast.error(`${data.errorMessage}`);
          }
        } catch (error) {
          console.log(error);
          toast.error('An error occurred');
        } 
      };





      const ViewStock = async (page = 1, filters = {}) => {
        console.log(filters,"juuuuuuuuuuuu");
        try {
            const response = await fetch(`${GET_STOCK_URL}?page=${page}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(filters)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setStockJournal(data?.content);
            setPagination({
                totalItems: data?.totalElements,
                totalPages: data?.totalPages,
                currentPage: data?.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
            toast.error("Failed to fetch Inventory");
        }
    };
    

    const handleUpdateSubmit = async (values) => {
  
              console.log(values,"jujujuju");
      try {
          const url = `${UPDATE_STOCK_URL }/${values?.stockId}`;
 
          const response = await fetch(url, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(values)
          });

          const data = await response.json();
          if (response.ok) {
           console.log(data,"coming ");
          
              toast.success(`Stock Updated successfully`);
              // navigate('/inventory/viewMaterialInventory');

          } else {
              toast.error(`${data.errorMessage}`);
          }
      } catch (error) {
          console.error(error);
          toast.error("An error occurred");
      } finally {
       
      }

  };



  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
        const response = await fetch(`${DELETE_STOCK_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            toast.success(data.message);
            const isCurrentPageEmpty = stockJournal.length === 1;
            if (isCurrentPageEmpty && pagination.currentPage > 1) {
                const previousPage = pagination.currentPage - 1;
                handlePageChange(previousPage);
            } else {
              ViewStock(pagination.currentPage);
            }
        } else {
            toast.error(data.errorMessage);
        }
    } catch (error) {
        console.error(error);
        toast.error("An error occurred");
    }
};

    // const handleUpdate = async (e, item) => {
    //     // Implement the update functionality
    //     console.log("Update item:", item);
    // };
    const handleUpdate = (e, item) => {
        console.log(item, "onupdate");
        e.preventDefault();
        // setEdit(true);
        if (item && item.id) {
            // setitemm(item);
            navigate(`/stockjournel/updateStockJournal/${item.id}`);
        } else {
            // Handle the case when the item or its ID is missing
            console.error("Item or its ID is missing");
        }

    };

    const handlePageChange = (page) => {
        ViewStock(page);
    };

    const getVoucherNo = async (page) => {
        try {
            const response = await fetch(`${VIEW_VOUCHERNOS}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data,"dataaaaaa");
            setVoucherNo(data);
          
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch order Number");
        }
    };
    

  

    return {
        currentstockJournel,
      
         handleSubmit,
         getVoucherNo,
        typeValues,



         handleUpdateSubmit,
        ViewStock,
        stockJournal,
        handleDelete,
        handleUpdate,
        handlePageChange,
        pagination,
        VoucherNo
       
        
    };
};

export default useStockJournel;