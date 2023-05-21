# MySQL address, user and password
# user must have replication privilege in MySQL.
my_addr = "{{.Env.BOATERSLIST_DB_HOST}}:{{.Env.BOATERSLIST_DB_PORT}}"
my_user = "{{.Env.BOATERSLIST_DB_USER}}"
my_pass = "{{.Env.BOATERSLIST_DB_PASSWORD}}"
my_charset = "utf8"

# Set true when elasticsearch use https
es_https = true
# Elasticsearch address
es_addr = "{{.Env.BOATERSLIST_OPENSEARCH_HOST}}"
# Elasticsearch user and password, maybe set by shield, nginx, or x-pack
es_user = "{{.Env.BOATERSLIST_OPENSEARCH_USER}}"
es_pass = "{{.Env.BOATERSLIST_OPENSEARCH_PASSWORD}}"

# Path to store data, like master.info, if not set or empty,
# we must use this to support breakpoint resume syncing.
# TODO: support other storage, like etcd.
data_dir = "./var"

# Inner Http status address
# TODO
stat_addr = "127.0.0.1:12800"
stat_path = "/metrics"

# pseudo server id like a slave
server_id = 1001

# mysql or mariadb
flavor = "mariadb"

# mysqldump execution path
# if not set or empty, ignore mysqldump.
mysqldump = "mariadb-dump"

# if we have no privilege to use mysqldump with --master-data,
# we must skip it.
#skip_master_data = false

# minimal items to be inserted in one bulk
bulk_size = 128

# force flush the pending requests if we don't have enough items >= bulk_size
flush_bulk_time = "200ms"

# Ignore table without primary key
skip_no_pk_table = false

# MySQL data source
[[source]]
schema = "boaterslist"

# Only below tables will be synced into Elasticsearch.
# "t_[0-9]{4}" is a wildcard table format, you can use it if you have many sub tables, like table_0000 - table_1023
# I don't think it is necessary to sync all tables in a database.
tables = ["Locations","Categories","SubCategories"]

# Below is for special rule mapping

[[rule]]
schema = "boaterslist"
table = "Categories"
    [rule.field]
    active=",boolean"

[[rule]]
schema = "boaterslist"
table = "SubCategories"
    [rule.field]
    active=",boolean"

[[rule]]
schema = "boaterslist"
table = "Locations"
    [rule.field]
    active=",boolean"
    coordinate=",geo_point"
    categories=",object"
    ctaJSON=",object"
    subCategories=",object"
    gold=",boolean"
    isPrivate=",boolean"
    listed=",boolean"
    membershipNeeded=",boolean"
    operatingDaysHoursJSON=",object"
    platinum=",boolean"
    premiere=",boolean"
    promotedSubCategories=",object"
    verified=",boolean"
