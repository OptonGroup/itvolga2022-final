module.exports = function optimisePage(html) {
    map_styles = new Map();
    str_styles = "<style>";
    str_scripts = "<script>";

    str_document = "";
    
    // Get all styles
    var ind = html.indexOf(">", html.indexOf("<style")+1);
    while (ind != -1){
        var end = html.indexOf("</style>", ind+1);
        style = html.substr(ind+7, end-ind-7).trim();

        styles = style.split(/}/);
        for (i = 0; i < styles.length; ++i){
            if (!styles[i].trim()) continue;
            temp = styles[i].split("{");
            if (temp.length < 1 || !temp[0] || !temp[1]) continue;
            name = temp[0].trim();
            style = temp[1].trim();
            if (name[0] == "@" && name[1] != "f" && name[1] != "r" && name[1] != "p"){
                str_styles += "\n\t" + name + "{";
                for (j = 1; j < temp.length; ++j){
                    if (temp[j].indexOf(": ") != -1)
                        str_styles += "\n\t\t\t" + temp[j].trim();
                    else{
                        if (j != 1 && temp[j-1].indexOf(": ") != -1) str_styles += "\n\t\t}"
                        str_styles += "\n\t\t" + temp[j].trim() + "{";
                    }
                }
                str_styles += "\n\t\t}"
                str_styles += "\n\t}";
                continue;
            }
            if (!map_styles[name]){
                map_styles[name] = new Map();
            }
            b = style.split(";");
            for (j = 0; j < b.length; ++j){
                if (!b[j].trim()) continue;
                tmp = b[j].split(": ");
                if (tmp.length != 2){
                    break;
                }
                map_styles[name][tmp[0].trim()] = tmp[1].trim();
            }
        }
        var ind = html.indexOf("<style", end+1);
        if (ind == -1) break;
        var ind = html.indexOf(">", ind+1);
    }
    // console.log(map_styles);

    // Styles from map to string
    for(name in map_styles){
        if (name[0] == '0' || name[0] == '1' || name[0] == '2' || name[0] == '3' || name[0] == '4' || name[0] == '5' || name[0] == '6' || name[0] == '7' || name[0] == '8' || name[0] == '9') continue;
        str_styles += "\n\t" + name + "{";
        for (style in map_styles[name]){
            str_styles += "\n\t\t" + style + ": " + map_styles[name][style] + ";";
        }
        str_styles += "\n\t}";
    }
    str_styles += "\n</style>"
    // console.log(str_styles);

    // Get all scripts
    var ind = html.indexOf("<script>");
    while (ind != -1){
        var end = html.indexOf("</script>", ind+1);
        script = html.substr(ind+8, end-ind-8).trim();

        str_scripts += "\n\t" + script;
        
        ind = html.indexOf("<script>", end+1);
    }
    str_scripts += "\n</script>"
    // console.log(str_scripts);
    


    // Get all document
    var start = 0, end = html.indexOf("</head>");
    while (start < end){
        
        var ind_style_start = html.indexOf("<style", start);
        if (ind_style_start == -1){
            ind_style_start = html.length + 100;
        }
        var ind_script_start = html.indexOf("<script>", start);
        if (ind_script_start == -1){
            ind_script_start = html.length + 100;
        }

        str_document += html.substr(start, Math.min(end, ind_style_start, ind_script_start)-start).trim();
        if (ind_style_start <= ind_script_start && ind_style_start <= end){
            start = html.indexOf("</style>", start)+8;
        }else if (ind_script_start <= ind_style_start && ind_script_start <= end){
            start = html.indexOf("</script>", start)+9;
        }else{
            start = end+1;
        }
    }
    str_document += "\n" + str_styles + "\n";

    start--;
    end = html.indexOf("</body>");
    while (start < end){
        
        var ind_style_start = html.indexOf("<style>", start);
        if (ind_style_start == -1){
            ind_style_start = html.length + 100;
        }
        var ind_script_start = html.indexOf("<script>", start);
        if (ind_script_start == -1){
            ind_script_start = html.length + 100;
        }

        str_document += html.substr(start, Math.min(end, ind_style_start, ind_script_start)-start).trim();
        if (ind_style_start < ind_script_start){
            start = html.indexOf("</style>", start)+8;
        }else if (ind_style_start > ind_script_start){
            start = html.indexOf("</script>", start)+9;
        }else{
            start = end+1;
        }
    }
    str_document += "\n" + str_scripts + "\n";

    start--;
    end = html.length;
    while (start < end){
        
        var ind_style_start = html.indexOf("<style>", start);
        if (ind_style_start == -1){
            ind_style_start = html.length + 100;
        }
        var ind_script_start = html.indexOf("<script>", start);
        if (ind_script_start == -1){
            ind_script_start = html.length + 100;
        }

        str_document += html.substr(start, Math.min(end, ind_style_start, ind_script_start)-start).trim();
        if (ind_style_start < ind_script_start){
            start = html.indexOf("</style>", start)+8;
        }else if (ind_style_start > ind_script_start){
            start = html.indexOf("</script>", start)+9;
        }else{
            start = end+1;
        }
    }
    // console.log(str_document);

    return (
        str_document
    )
}
