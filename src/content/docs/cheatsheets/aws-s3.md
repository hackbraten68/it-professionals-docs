---
title: S3 - Simple Storage Service
description: S3 Cheatsheet
---

## AWS S3 Cheat Sheet

- S3 stands for Simple Storage Service.
- It provides object storage through a web service interface.
- Each object is stored as a file with its metadata included and is given an ID number.
- Objects uploaded to S3 are stored in containers called Buckets, whose names are unique and they organize the Amazon S3 namespace at the highest level.
- These buckets are region specific.
- You can assign permissions to these buckets, in order to provide access or restrict data transaction.
- Applications use this ID number to access an object.
- Developers can access an object via a REST API.
- Supports upload of objects.
- Uses the same scalable storage infrastructure that Amazon.com uses to run its global e-commerce network.
- Designed for storing online backup and archiving of data and applications on AWS.
- Data access is provided through S3 console, which is a simple web-based interface.
- Data stored can be either Public or Private based on user requirement.
- Data stored can be encrypted.
- We can define life-cycle policies which can help in automation of data transfer, retention and deletion.
- Amazon Athena can be used to query S3 data as per demand.

Storage classes provided by Amazon S3:
- **Standard:** Designed for high durability, availability, and performance for frequently accessed data.
- **Standard_IA (Standard Infrequent Access):** Lower-cost option for data that is accessed less frequently, with the same durability as Standard.
- **Intelligent_Tiering:** Automatically moves data between two access tiers (frequent and infrequent) based on access patterns, optimizing costs.
- **OneZone_IA:** Similar to Standard_IA but stores data in a single Availability Zone, reducing costs further.
- **Glacier:** Low-cost storage for data archiving and long-term backup with varying retrieval options.
- **Deep_Archive:** Lowest-cost storage for data that is accessed rarely, ideal for compliance and archival use cases.
- **RRS (Reduced Redundancy Storage):** Previously offered for non-critical, reproducible data at lower redundancy and cost, but not recommended by AWS anymore.

These storage classes provide flexibility and cost optimization depending on the access frequency and durability requirements of your data.