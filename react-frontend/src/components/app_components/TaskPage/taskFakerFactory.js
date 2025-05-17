
import { faker } from "@faker-js/faker";
export default (user,count,assignedToIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
id: faker.lorem.sentence(""),
title: faker.lorem.sentence(""),
assignedTo: assignedToIds[i % assignedToIds.length],
dueDate: faker.lorem.sentence(""),
status: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
