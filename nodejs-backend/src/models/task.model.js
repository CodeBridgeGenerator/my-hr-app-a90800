
    module.exports = function (app) {
        const modelName = 'task';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            id: { type: Schema.Types.Mixed, required: false },
title: { type:  String , required: true },
assignedTo: { type: Schema.Types.ObjectId, ref: "employee" },
dueDate: { type: Date, required: false },
status: { type:  String , required: true },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };