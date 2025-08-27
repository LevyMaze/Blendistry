---
title: "Database Normalization Explained"
date: "2025-08-27"
author: "Site Owner"
category: "Database"
image: "https://bs-uploads.toptal.io/blackfish-uploads/components/blog_post_page/4084683/cover_image/regular_1708x683/0712-Bad_Practices_in_Database_Design_-_Are_You_Making_These_Mistakes_Dan_Newsletter-549c07a55cc276f4204263b6e6bef737.png"
---

# Database Normalization Explained

Database normalization is the process of organizing tables to **reduce redundancy** and **improve data integrity**.

## Why Normalize?

- Avoid duplicate data
- Ensure consistency
- Make maintenance easier

## Normal Forms

1. **1NF (First Normal Form)**: Eliminate repeating groups.
2. **2NF (Second Normal Form)**: Remove partial dependencies.
3. **3NF (Third Normal Form)**: Remove transitive dependencies.

## Example

Before normalization:

| OrderID | CustomerName | Product | Quantity |
|---------|--------------|---------|----------|
| 1       | Alice        | Book    | 2        |
| 2       | Alice        | Pen     | 5        |

After normalization:

**Customers Table**

| CustomerID | CustomerName |
|------------|--------------|
| 1          | Alice        |

**Orders Table**

| OrderID | CustomerID |
|---------|------------|
| 1       | 1          |
| 2       | 1          |

**OrderItems Table**

| OrderID | Product | Quantity |
|---------|---------|----------|
| 1       | Book    | 2        |
| 2       | Pen     | 5        |

Normalization improves **query efficiency** and **data consistency**.
