export default class BatchModify {
    constructor() {
        this.tempId = -1;
        this.modifyData = {
            AddedRecords: [],
            ChangedRecords: [],
            DeletedRecords: []
        }
    }

    reset() {
        this.modifyData = {
            AddedRecords: [],
            ChangedRecords: [],
            DeletedRecords: []
        }
    }

    hasChanged() {
        return this.modifyData.AddedRecords.length > 0 ||
            this.modifyData.ChangedRecords.length > 0 ||
            this.modifyData.DeletedRecords.length > 0
    }

    insert(insertItem) {
        insertItem.Id = this.tempId--;
        this.modifyData.AddedRecords.push(insertItem);
    }

    update(updateItem) {
        let index = this.modifyData.AddedRecords.findIndex(
            item => item.Id === updateItem.Id
        );
        if (index >= 0)
            this.modifyData.AddedRecords[index] = updateItem;
        else {
            this.modifyData.ChangedRecords = this.modifyData.ChangedRecords.filter(
                item => item.Id !== updateItem.Id
            );
            this.modifyData.ChangedRecords.push(updateItem);
        }
    }

    delete(deleteItem) {
        if (
            this.modifyData.AddedRecords.some(
                item => item.Id === deleteItem.Id
            )
        )
            this.modifyData.AddedRecords = this.modifyData.AddedRecords.filter(
                item => item.Id !== deleteItem.Id
            );
        else {
            if (
                this.modifyData.ChangedRecords.some(
                    item => item.Id === deleteItem.Id
                )
            )
                this.modifyData.ChangedRecords = this.modifyData.ChangedRecords.filter(
                    item => item.Id !== deleteItem.Id
                );
            this.modifyData.DeletedRecords.push(deleteItem);
        }
    }
}