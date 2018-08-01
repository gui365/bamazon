SELECT departments.department_name,
       products.product_sales,
       departments.over_head_costs,
       (products.product_sales - departments.over_head_costs) AS total_profit
FROM departments
LEFT JOIN products ON products.department_name = departments.department_name
GROUP BY departments.department_name;