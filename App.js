Ext.define("CustomApp", {
    extend: "Rally.app.App", componentCls: "app",
    launch: function () {
        this._loadData();
    },

    _showTable: function () {

        var table = Ext.create("Ext.grid.Panel", {
            title: "Manual vs. Automated comparison table",
            store: Ext.data.StoreManager.lookup("simpsonsStore"),
            columns: [
                {
                    text: "",
                    dataIndex: "type",
                    align: 'left',
                }, {
                    text: "Manual",
                    dataIndex: "manual",
                    align: 'center',
                }, {
                    text: "Automated",
                    dataIndex: "auto",
                    align: 'center',
                    flex: 1,
                }, {
                    text: "Total # of TC",
                    dataIndex: "tc",
                    align: 'center',
                }],
            width: 500,
            padding: 15
        });

        this.add(table);
    },


    _createTable: function (obj) {

        obj.type = 'All';

        Ext.create("Ext.data.Store", {
            storeId: "simpsonsStore",
            fields: ["type", "manual", "auto", "tc"],
            data: {
                items: obj
            },
            proxy: {
                type: "memory",
                reader: {
                    type: "json",
                    root: "items"
                }
            }
        });

        if (obj.auto && obj.manual && obj.type && obj.tc) {
            this._showTable();
        }
    },

    _loadData: function () {
        var me = this;

        var manualFilter = Ext.create('Rally.data.wsapi.Filter', {
            id: 'manualCount',
            property: 'Method',
            operation: '=',
            value: 'Manual'
        });

        var automatedFilter = Ext.create('Rally.data.wsapi.Filter', {
            id: 'automatedCount',
            property: 'Method',
            operation: '=',
            value: 'Automated'
        });

        me.arrayC = {
            manual: '',
            auto: '',
            tc: ''
        };

        [
            manualFilter,
            automatedFilter,
            manualFilter.or(automatedFilter)
        ].forEach(function (filter) {
            Ext.create('Rally.data.wsapi.Store', {
                model: 'Test Case',
                autoLoad: true,
                filters: filter,
                listeners: {
                    load: function (myStore) {
                        console.log(myStore);
                        switch (filter.id) {
                            case 'manualCount':
                                me.arrayC.manual = myStore.totalCount;
                                break;
                            case'automatedCount':
                                me.arrayC.auto = myStore.totalCount;
                                break;
                            default:
                                me.arrayC.tc = myStore.totalCount;
                        }
                        me._createTable(me.arrayC);
                    },
                    scope: this
                },
                fetch: ['Type', 'Method']
            })
            ;
        });
    }
});