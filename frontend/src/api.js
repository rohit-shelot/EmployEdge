const BASE_URL = "http://localhost:1000";

export const GetAllEmployees = async (search = "", page = 1, limit = 5) => {
  try {
    const url = `${BASE_URL}/api/employees?search=${search}&page=${page}&limit=${limit}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching employees:", err);
    throw err;
  }
};

export const GetEmployeeDetailsById = async (id) => {
  try {
    const url = `${BASE_URL}/api/employees/${id}`;
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching employee details:", err);
    throw err;
  }
};

export const DeleteEmployeeById = async (id) => {
  const url = `${BASE_URL}/api/employees/${id}`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const result = await fetch(url, options);
    const data = await result.json();
    console.log(data);
    return data;
  } catch (err) {
    return err;
  }
};

export const CreateEmployee = async (empObj) => {
  const url = `${BASE_URL}/api/employees`;
  console.log("url ", url);
  const formData = new FormData();

  for (const key in empObj) {
    formData.append(key, empObj[key]);
  }
  const options = {
    method: "POST",
    body: formData,
    credentials: "include",
  };
  try {
    const result = await fetch(url, options);
    const data = await result.json();
    return data;
  } catch (err) {
    return err;
  }
};

export const UpdateEmployeeById = async (empObj, id) => {
  const url = `${BASE_URL}/api/employees/${id}`;
  console.log("url ", url);
  const formData = new FormData();

  for (const key in empObj) {
    formData.append(key, empObj[key]);
  }
  const options = {
    method: "PUT",
    body: formData,
    credentials: "include",
  };
  try {
    const result = await fetch(url, options);
    const data = await result.json();
    console.log("<---update--> ", data);
    return data;
  } catch (err) {
    return err;
  }
};
