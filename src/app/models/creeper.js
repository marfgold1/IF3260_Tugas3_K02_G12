export default {
    RBody: {
        children: {
            PBody: {
                options: {
                    position: [0,1,0],
                    scale: [0.5, 2, 1],
                },
            },
            RHead: {
                options: {
                    position: [0, 2, 0],
                },
                children: {
                    PHead: {
                        options: {
                            position: [0, 0.5, 0],
                        },
                    },
                },
            },
            RLegFL: {
                options: {
                    position: [0.25, 0, -0.25],
                },
                children: {
                    PLegFR: {
                        options: {
                            position: [0.25, -0.5, 0],
                            scale: [0.5, 1, 0.5],
                        },
                    },
                },
            },
            RLegFR: {
                options: {
                    position: [0.25, 0, 0.25],
                },
                children: {
                    PLegFL: {
                        options: {
                            position: [0.25, -0.5, 0],
                            scale: [0.5, 1, 0.5],
                        },
                    },
                },
            },
            RLegBL: {
                options: {
                    position: [-0.25, 0, -0.25],
                },
                children: {
                    PLegBR: {
                        options: {
                            position: [-0.25, -0.5, 0],
                            scale: [0.5, 1, 0.5],
                        },
                    },
                },
            },
            RLegBR: {
                options: {
                    position: [-0.25, 0, 0.25],
                },
                children: {
                    PLegBL: {
                        options: {
                            position: [-0.25, -0.5, 0],
                            scale: [0.5, 1, 0.5],
                        },
                    },
                },
            },
        }
    }
}