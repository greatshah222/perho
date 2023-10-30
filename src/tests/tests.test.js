const { createGroupItemId, checkVod } = require("../scripts/utils");

test("createGroupItemId should output groupItemIds separated with comma", () => {
    const testCategories = [{id: 51338857, title: "Sarjat"}, {id: 12356244, title: "Dokkarit"}]
    const createdId = createGroupItemId(testCategories);
    expect(createdId).toBe("51338857,12356244");
});

test("createGroupItemId should output single groupItemId without comma", () => {
    const testCategories = [{id: 51338857, title: "Sarjat"}]
    const createdId = createGroupItemId(testCategories);
    expect(createdId).toBe("51338857");
});

test("checkVod should output correct vod (svod) from routeconfigs, depending on pathname", () => {
    const testRoutes =
    {
        "categories" : "categories",
        "profile" : "profile",
        "svod" : "svod",
        "tvod" : "tvod",
    };

    const vod = checkVod(testRoutes, "http://localhost:3000/svod/detailsVideo/55621438");
    expect(vod).toBe("svod");
});

