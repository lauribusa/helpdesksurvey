exports.registerHelpers = (hbs)=>{
    
    hbs.registerHelper("stringify", (content)=>{
        return JSON.stringify(content);
    })
    hbs.registerHelper('list', (content, limit)=>{
        return content.slice(0, limit);
    });
};