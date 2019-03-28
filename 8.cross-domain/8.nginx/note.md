### homebrew的用法
- homebrew是mac OS系统平台下的软件包管理工具
- brew install 软件     下载安装软件
- brew uninstall 软件   卸载软件
- brew reinstall 软件   重新下载安装软件
- brew upgrade 软件     升级更新软件
- brew info 软件        查看软件信息
- brew list            查看已经安装的软件

### nginx的用法
- mac上使用brew下载nginx后，可以修改nginx的配置文件nginx.conf增加跨域头，即可实现跨域
- sudo nginx 启动nginx服务
- sudo nginx -t 判断配置文件是否正确 (可能第一次使用brew下载nginx，在nginx目录下没有nginx.conf配置文件，执行下此命令即可看到配置文件)
- sudo nginx -s stop 停止nginx
- sudo nginx -s reload 重启nginx
- mac上查看nginx文件所在的位置  cd /usr/local/etc/nginx
> 参考[mac下配置nginx](https://www.cnblogs.com/hzdx/p/nginx_seting.html)

### nginx配置文件详解
```
#定义Nginx运行的用户和用户组，来指定Nginx Worker进程运行用户以及用户组，默认由nobody账号运行
#user  nobody;
#nginx进程数，建议设置为等于CPU总核心数
worker_processes  1;
#全局错误日志定义类型，[ debug | info | notice | warn | error | crit ]，其中debug输出日志最为最详细，而crit输出日志最少
#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;
#进程文件，用来指定进程id的存储文件位置
#pid        logs/nginx.pid;

#工作模式与连接数上限
events {
    worker_connections  1024;
}

#设定http服务器
http {
    #来用设定文件的mime类型,类型在配置文件目录下的mime.type文件定义，来告诉nginx来识别文件类型
    include       mime.types;
    #默认文件类型
    default_type  application/octet-stream;
    #用于设置日志的格式，和记录哪些参数，这里设置为main，刚好用于access_log来纪录这种类型
    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;
    #开启高效文件传输模式，sendfile指令指定nginx是否调用sendfile函数来输出文件，对于普通应用设为 on，如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络I/O处理速度，降低系统的负载。注意：如果图片显示不正常把这个改成off。
    sendfile        on;
    #tcp_nopush     on;
    #长连接超时时间，单位是秒
    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;
    #虚拟主机的配置
    server {
        #监听端口
        listen       8080;
        #域名可以有多个，用空格隔开
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}
    include servers/*;
}
```