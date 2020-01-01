export const Routes = {
    home() {
        return "/";
    },
    createCampaign() {
        return "/campaign/create";
    },
    editCampaign(id: string) {
        return `/campaign/create/${id}`;
    }
};
